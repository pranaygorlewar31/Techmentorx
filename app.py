import React, { useState } from 'react';
import { MapPin, Gift, Award, Users, CheckCircle, Heart } from 'lucide-react';

const SocialMentor = () => {
  const [activeTab, setActiveTab] = useState('browse');
  
  // Mock Data for Donations
  const donations = [
    { id: 1, item: "Warm Winter Coats", donor: "City High Alumni", location: "2 miles away", points: 50, type: "Clothes" },
    { id: 2, item: "Unused Stationery Sets", donor: "Local Bookstore", location: "0.5 miles away", points: 20, type: "Education" },
    { id: 3, item: "Canned Food Drive", donor: "Alpha Beta Club", location: "4 miles away", points: 40, type: "Food" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* --- Navigation --- */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
          <Heart fill="currentColor" /> SocialMentor
        </h1>
        <div className="flex gap-6 font-medium text-slate-600">
          <button onClick={() => setActiveTab('browse')} className={activeTab === 'browse' ? "text-indigo-600" : ""}>Browse</button>
          <button onClick={() => setActiveTab('impact')} className={activeTab === 'impact' ? "text-indigo-600" : ""}>My Impact</button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">Donate Now</button>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="bg-indigo-600 py-16 px-6 text-center text-white">
        <h2 className="text-4xl font-extrabold mb-4">Bridging the Gap Between Surplus and Need</h2>
        <p className="text-indigo-100 max-w-2xl mx-auto text-lg">
          Connect with local donors, earn certificates, and track your contribution to a better community.
        </p>
      </header>

      {/* --- Main Dashboard --- */}
      <main className="max-w-6xl mx-auto p-6 -mt-10">
        
        {activeTab === 'browse' ? (
          <section>
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <MapPin className="text-indigo-600" /> Nearby Opportunities
              </h3>
              <span className="text-sm text-slate-500 underline cursor-pointer">Filter by Category</span>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {donations.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2 py-1 rounded">{item.type}</span>
                    <span className="text-green-600 font-bold text-sm">+{item.points} XP</span>
                  </div>
                  <h4 className="font-bold text-lg mb-1">{item.item}</h4>
                  <p className="text-slate-500 text-sm mb-4">Posted by {item.donor}</p>
                  <div className="flex items-center gap-1 text-slate-400 text-xs mb-4">
                    <MapPin size={14} /> {item.location}
                  </div>
                  <button className="w-full bg-slate-900 text-white py-2 rounded-lg font-medium hover:bg-slate-800">
                    Accept Task
                  </button>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="bg-white p-8 rounded-2xl shadow-sm border">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                <Users size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Alex Johnson</h3>
                <p className="text-slate-500">Gold Tier Volunteer • 450 Points</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8 text-center">
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                <Gift className="mx-auto mb-2 text-orange-500" />
                <div className="text-2xl font-bold">12</div>
                <div className="text-xs text-slate-600">Items Delivered</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <Award className="mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">3</div>
                <div className="text-xs text-slate-600">Certificates Earned</div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                <CheckCircle className="mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">98%</div>
                <div className="text-xs text-slate-600">Success Rate</div>
              </div>
            </div>
            
            <button className="w-full border-2 border-indigo-600 text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-50 transition">
              Download Latest Certificate
            </button>
          </section>
        )}
      </main>

      <footer className="mt-20 py-10 border-t bg-white text-center text-slate-400 text-sm">
        <p>© 2026 Social Mentor Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SocialMentor;