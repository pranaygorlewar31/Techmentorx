from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
import math
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///social_mentor.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    phone = db.Column(db.String(20))
    city = db.Column(db.String(100))
    area = db.Column(db.String(100))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    points = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    donations = db.relationship('Donation', backref='donor', lazy=True, foreign_keys='Donation.donor_id')
    volunteered_donations = db.relationship('Donation', backref='volunteer', lazy=True, foreign_keys='Donation.volunteer_id')

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'phone': self.phone,
            'city': self.city,
            'area': self.area,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'points': self.points,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Donation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    donor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    volunteer_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    quantity = db.Column(db.String(50))
    pickup_address = db.Column(db.String(200))
    city = db.Column(db.String(100))
    area = db.Column(db.String(100))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    collected_at = db.Column(db.DateTime)
    delivered_at = db.Column(db.DateTime)
    recipient_name = db.Column(db.String(100))
    recipient_contact = db.Column(db.String(20))

    def to_dict(self):
        return {
            'id': self.id,
            'donor_id': self.donor_id,
            'donor': self.donor.to_dict() if self.donor else None,
            'volunteer_id': self.volunteer_id,
            'volunteer': self.volunteer.to_dict() if self.volunteer else None,
            'category': self.category,
            'description': self.description,
            'quantity': self.quantity,
            'pickup_address': self.pickup_address,
            'city': self.city,
            'area': self.area,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'collected_at': self.collected_at.isoformat() if self.collected_at else None,
            'delivered_at': self.delivered_at.isoformat() if self.delivered_at else None,
            'recipient_name': self.recipient_name,
            'recipient_contact': self.recipient_contact
        }

class Certificate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    certificate_type = db.Column(db.String(50))
    issued_at = db.Column(db.DateTime, default=datetime.utcnow)
    donations_count = db.Column(db.Integer)
    user = db.relationship('User', backref='certificates')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'certificate_type': self.certificate_type,
            'issued_at': self.issued_at.isoformat() if self.issued_at else None,
            'donations_count': self.donations_count
        }

class Impact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    donation_id = db.Column(db.Integer, db.ForeignKey('donation.id'), nullable=False)
    people_helped = db.Column(db.Integer)
    feedback = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    donation = db.relationship('Donation', backref='impacts')

    def to_dict(self):
        return {
            'id': self.id,
            'donation_id': self.donation_id,
            'people_helped': self.people_helped,
            'feedback': self.feedback,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

# Helper Functions
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'message': 'User not found'}), 401
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate distance using Haversine formula (in km)"""
    R = 6371
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = math.sin(delta_lat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    return R * c

def award_points(user, action):
    """Award points for different actions"""
    points_map = {
        'donation': 10,
        'volunteer_collect': 15,
        'volunteer_deliver': 20,
        'first_donation': 50
    }
    points = points_map.get(action, 0)
    user.points += points
    db.session.commit()
    check_certificate_eligibility(user)

def check_certificate_eligibility(user):
    """Check if user is eligible for a certificate"""
    if user.role == 'donor':
        donation_count = Donation.query.filter_by(donor_id=user.id, status='delivered').count()
    elif user.role == 'volunteer':
        donation_count = Donation.query.filter_by(volunteer_id=user.id, status='delivered').count()
    else:
        return
    
    certificate_levels = [
        (100, 'platinum'),
        (50, 'gold'),
        (20, 'silver'),
        (5, 'bronze')
    ]
    
    for count, cert_type in certificate_levels:
        if donation_count >= count:
            existing = Certificate.query.filter_by(user_id=user.id, certificate_type=cert_type).first()
            if not existing:
                cert = Certificate(user_id=user.id, certificate_type=cert_type, donations_count=donation_count)
                db.session.add(cert)
                db.session.commit()
            break

# API Routes

# Authentication Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 400
    
    hashed_password = generate_password_hash(data['password'])
    user = User(
        username=data['username'],
        email=data['email'],
        password=hashed_password,
        role=data['role'],
        phone=data.get('phone'),
        city=data.get('city'),
        area=data.get('area'),
        latitude=data.get('latitude'),
        longitude=data.get('longitude')
    )
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'Registration successful'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user and check_password_hash(user.password, data['password']):
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(days=7)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'token': token,
            'user': user.to_dict()
        }), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify(current_user.to_dict()), 200

# Donation Routes
@app.route('/api/donations', methods=['GET'])
@token_required
def get_donations(current_user):
    if current_user.role == 'donor':
        donations = Donation.query.filter_by(donor_id=current_user.id).order_by(Donation.created_at.desc()).all()
    elif current_user.role == 'volunteer':
        # Get assigned donations
        donations = Donation.query.filter_by(volunteer_id=current_user.id).order_by(Donation.created_at.desc()).all()
    elif current_user.role == 'admin':
        donations = Donation.query.order_by(Donation.created_at.desc()).limit(100).all()
    else:
        donations = []
    
    return jsonify([d.to_dict() for d in donations]), 200

@app.route('/api/donations/nearby', methods=['GET'])
@token_required
def get_nearby_donations(current_user):
    if current_user.role != 'volunteer':
        return jsonify({'message': 'Only volunteers can view nearby donations'}), 403
    
    available = Donation.query.filter_by(status='pending').all()
    nearby = []
    
    if current_user.latitude and current_user.longitude:
        for donation in available:
            if donation.latitude and donation.longitude:
                distance = calculate_distance(
                    current_user.latitude, current_user.longitude,
                    donation.latitude, donation.longitude
                )
                if distance <= 20:
                    donation_dict = donation.to_dict()
                    donation_dict['distance'] = round(distance, 2)
                    nearby.append(donation_dict)
        
        nearby.sort(key=lambda x: x['distance'])
    
    return jsonify(nearby), 200

@app.route('/api/donations', methods=['POST'])
@token_required
def create_donation(current_user):
    if current_user.role != 'donor':
        return jsonify({'message': 'Only donors can create donations'}), 403
    
    data = request.get_json()
    
    donation = Donation(
        donor_id=current_user.id,
        category=data['category'],
        description=data['description'],
        quantity=data['quantity'],
        pickup_address=data['pickup_address'],
        city=data.get('city', current_user.city),
        area=data.get('area', current_user.area),
        latitude=data.get('latitude', current_user.latitude),
        longitude=data.get('longitude', current_user.longitude)
    )
    
    db.session.add(donation)
    db.session.commit()
    
    # Award points
    first_donation = Donation.query.filter_by(donor_id=current_user.id).count() == 1
    if first_donation:
        award_points(current_user, 'first_donation')
    award_points(current_user, 'donation')
    
    return jsonify(donation.to_dict()), 201

@app.route('/api/donations/<int:donation_id>', methods=['GET'])
@token_required
def get_donation(current_user, donation_id):
    donation = Donation.query.get_or_404(donation_id)
    return jsonify(donation.to_dict()), 200

@app.route('/api/donations/<int:donation_id>/accept', methods=['POST'])
@token_required
def accept_donation(current_user, donation_id):
    if current_user.role != 'volunteer':
        return jsonify({'message': 'Only volunteers can accept donations'}), 403
    
    donation = Donation.query.get_or_404(donation_id)
    
    if donation.status != 'pending':
        return jsonify({'message': 'Donation already assigned'}), 400
    
    donation.volunteer_id = current_user.id
    donation.status = 'assigned'
    db.session.commit()
    
    return jsonify(donation.to_dict()), 200

@app.route('/api/donations/<int:donation_id>/collect', methods=['POST'])
@token_required
def collect_donation(current_user, donation_id):
    if current_user.role != 'volunteer':
        return jsonify({'message': 'Only volunteers can collect donations'}), 403
    
    donation = Donation.query.get_or_404(donation_id)
    
    if donation.volunteer_id != current_user.id:
        return jsonify({'message': 'Not your donation'}), 403
    
    donation.status = 'collected'
    donation.collected_at = datetime.utcnow()
    db.session.commit()
    
    award_points(current_user, 'volunteer_collect')
    
    return jsonify(donation.to_dict()), 200

@app.route('/api/donations/<int:donation_id>/deliver', methods=['POST'])
@token_required
def deliver_donation(current_user, donation_id):
    if current_user.role != 'volunteer':
        return jsonify({'message': 'Only volunteers can deliver donations'}), 403
    
    donation = Donation.query.get_or_404(donation_id)
    
    if donation.volunteer_id != current_user.id:
        return jsonify({'message': 'Not your donation'}), 403
    
    data = request.get_json()
    
    donation.status = 'delivered'
    donation.delivered_at = datetime.utcnow()
    donation.recipient_name = data.get('recipient_name')
    donation.recipient_contact = data.get('recipient_contact')
    
    # Create impact record
    impact = Impact(
        donation_id=donation.id,
        people_helped=data.get('people_helped'),
        feedback=data.get('feedback')
    )
    db.session.add(impact)
    db.session.commit()
    
    award_points(current_user, 'volunteer_deliver')
    
    return jsonify(donation.to_dict()), 200

# Statistics Routes
@app.route('/api/stats', methods=['GET'])
@token_required
def get_stats(current_user):
    if current_user.role == 'donor':
        donations = Donation.query.filter_by(donor_id=current_user.id).all()
        stats = {
            'total': len(donations),
            'pending': len([d for d in donations if d.status == 'pending']),
            'delivered': len([d for d in donations if d.status == 'delivered'])
        }
    elif current_user.role == 'volunteer':
        assigned = Donation.query.filter_by(volunteer_id=current_user.id).all()
        nearby_count = 0
        if current_user.latitude and current_user.longitude:
            available = Donation.query.filter_by(status='pending').all()
            for donation in available:
                if donation.latitude and donation.longitude:
                    distance = calculate_distance(
                        current_user.latitude, current_user.longitude,
                        donation.latitude, donation.longitude
                    )
                    if distance <= 20:
                        nearby_count += 1
        
        stats = {
            'available': nearby_count,
            'assigned': len([d for d in assigned if d.status in ['assigned', 'collected']]),
            'completed': len([d for d in assigned if d.status == 'delivered'])
        }
    elif current_user.role == 'admin':
        stats = {
            'users': User.query.count(),
            'donations': Donation.query.count(),
            'delivered': Donation.query.filter_by(status='delivered').count(),
            'pending': Donation.query.filter_by(status='pending').count()
        }
    else:
        stats = {}
    
    return jsonify(stats), 200

# Leaderboard Routes
@app.route('/api/leaderboard', methods=['GET'])
@token_required
def get_leaderboard(current_user):
    top_donors = User.query.filter_by(role='donor').order_by(User.points.desc()).limit(10).all()
    top_volunteers = User.query.filter_by(role='volunteer').order_by(User.points.desc()).limit(10).all()
    
    return jsonify({
        'donors': [u.to_dict() for u in top_donors],
        'volunteers': [u.to_dict() for u in top_volunteers]
    }), 200

# Certificate Routes
@app.route('/api/certificates', methods=['GET'])
@token_required
def get_certificates(current_user):
    certificates = Certificate.query.filter_by(user_id=current_user.id).order_by(Certificate.issued_at.desc()).all()
    return jsonify([c.to_dict() for c in certificates]), 200

# Impact Routes
@app.route('/api/impact', methods=['GET'])
@token_required
def get_impact(current_user):
    if current_user.role == 'donor':
        donations = Donation.query.filter_by(donor_id=current_user.id, status='delivered').all()
    elif current_user.role == 'volunteer':
        donations = Donation.query.filter_by(volunteer_id=current_user.id, status='delivered').all()
    else:
        donations = Donation.query.filter_by(status='delivered').all()
    
    total_people_helped = 0
    impacts = []
    
    for donation in donations:
        for impact_record in donation.impacts:
            total_people_helped += impact_record.people_helped or 0
            impacts.append({
                'donation': donation.to_dict(),
                'impact': impact_record.to_dict()
            })
    
    return jsonify({
        'total': total_people_helped,
        'impacts': impacts
    }), 200

# Initialize database
with app.app_context():
    db.create_all()
    
    # Create admin user if not exists
    admin = User.query.filter_by(username='admin').first()
    if not admin:
        admin = User(
            username='admin',
            email='admin@socialmentor.com',
            password=generate_password_hash('admin123'),
            role='admin',
            city='Mumbai',
            area='Central'
        )
        db.session.add(admin)
        db.session.commit()

if __name__ == '__main__':
    app.run(debug=True, port=5000)