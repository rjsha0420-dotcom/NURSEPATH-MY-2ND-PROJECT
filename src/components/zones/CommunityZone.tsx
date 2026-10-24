import React, { useState } from 'react';
import { 
  Users, 
  Briefcase, 
  Award, 
  BookOpen, 
  MessageSquare, 
  ThumbsUp, 
  Globe, 
  Search, 
  Filter, 
  CheckCircle2, 
  ExternalLink,
  Send,
  Plus
} from 'lucide-react';
import { 
  MOCK_COMMUNITY_POSTS, 
  MOCK_MENTORS, 
  MOCK_GLOBAL_JOBS, 
  MOCK_SCHOLARSHIPS, 
  MOCK_JOURNAL_ALERTS, 
  CommunityPost 
} from '../../data/mockCommunity';
import { UserProfile } from '../../types';

interface CommunityZoneProps {
  user: UserProfile;
  onOpenSubscription: () => void;
}

export const CommunityZone: React.FC<CommunityZoneProps> = ({ user, onOpenSubscription }) => {
  const [activeTab, setActiveTab] = useState<'forum' | 'mentors' | 'jobs' | 'scholarships' | 'journals'>('forum');
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('All');
  const [jobSearch, setJobSearch] = useState<string>('');

  // Mentorship request state
  const [requestedMentorId, setRequestedMentorId] = useState<string | null>(null);

  // New post state
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  const handleLikePost = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    const newPost: CommunityPost = {
      id: 'post-' + Date.now(),
      authorName: user.name,
      authorRole: `${user.role.toUpperCase()} Scholar`,
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      badge: 'Verified Member',
      category: 'Clinical Practice',
      title: newPostTitle,
      content: newPostContent,
      likes: 1,
      repliesCount: 0,
      timeAgo: 'Just now',
      tags: ['Discussion', 'NurseLife']
    };
    setPosts([newPost, ...posts]);
    setIsCreatingPost(false);
    setNewPostTitle('');
    setNewPostContent('');
  };

  const filteredJobs = MOCK_GLOBAL_JOBS.filter((j) => {
    const matchesCountry = selectedCountryFilter === 'All' || j.country === selectedCountryFilter;
    const matchesSearch = j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.institution.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.location.toLowerCase().includes(jobSearch.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-violet-900 via-purple-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-violet-400/30 text-violet-200 border border-violet-300/30 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              🟣 Zone 6: Community & Global Network
            </span>
            <span className="text-violet-300 text-xs font-semibold">One Journey, No Borders</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Connect Worldwide. Find Mentors, Global Jobs & Research Grants.
          </h1>
          <p className="text-sm text-violet-100/90 mt-1 leading-relaxed">
            Multi-role peer discussions across undergrad to doctoral scholarship, 1-on-1 verified international nurse mentorship matching, global direct-hire hospital job board with visa sponsorships, and peer-reviewed journal alerts.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto space-x-2 pb-1 scrollbar-none">
        {[
          { id: 'forum', label: '💬 Community Discussions', badge: `${posts.length} Active Threads` },
          { id: 'mentors', label: '🤝 Global Mentorship Board', badge: 'US/UK/AUS Mentors' },
          { id: 'jobs', label: '🌐 Global Job Board', badge: 'Visa Sponsorships' },
          { id: 'scholarships', label: '🎓 Scholarships & Grants', badge: 'CHED & Fulbright' },
          { id: 'journals', label: '📖 Research & Journal Alerts', badge: 'AJN / PJN' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-violet-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === tab.id ? 'bg-violet-900 text-violet-200' : 'bg-slate-200 text-slate-600'
            }`}>
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Tab 1: Discussions Forum */}
      {activeTab === 'forum' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Trending Nursing Discussions
              </span>
              <button
                onClick={() => setIsCreatingPost(!isCreatingPost)}
                className="bg-violet-800 hover:bg-violet-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Start Discussion</span>
              </button>
            </div>

            {isCreatingPost && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <input
                  type="text"
                  placeholder="Discussion Title..."
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                />
                <textarea
                  placeholder="Share your clinical question, NCLEX tips, or research inquiry..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white min-h-[90px]"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleCreatePost}
                    className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                  >
                    Post to Network
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-xs text-slate-900">{post.authorName}</span>
                          <span className="text-[10px] bg-violet-50 text-violet-700 font-bold px-1.5 py-0.2 rounded border border-violet-200">
                            {post.badge}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">{post.authorRole} • {post.timeAgo}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-900 leading-snug">{post.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{post.content}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className="flex items-center space-x-1.5 text-slate-600 hover:text-teal-700 font-bold cursor-pointer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{post.likes} Helpful</span>
                    </button>
                    <span className="flex items-center space-x-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.repliesCount} Replies</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900">NURSEPATH Community Guidelines</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our global network adheres to HIPAA, the Philippine Data Privacy Act (RA 10173), and the ICN Code of Ethics. No patient identifiable information (PHI) is permitted in public forums.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Mentorship Board */}
      {activeTab === 'mentors' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {MOCK_MENTORS.map((mentor) => (
              <div key={mentor.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{mentor.name}</h4>
                      <p className="text-xs font-semibold text-teal-800">{mentor.credentials}</p>
                      <p className="text-[11px] text-slate-500">{mentor.hospitalOrUniversity}</p>
                    </div>
                    {mentor.verifiedBadge && (
                      <span className="bg-teal-50 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-200">
                        Verified
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{mentor.bio}</p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-800 block">Mentorship Topics:</span>
                    <div className="flex flex-wrap gap-1">
                      {mentor.mentorshipTopics.map((top, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {top}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {mentor.slotsAvailable} Slots Open This Month
                  </span>
                  <button
                    onClick={() => setRequestedMentorId(mentor.id)}
                    className="bg-violet-800 hover:bg-violet-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs cursor-pointer"
                  >
                    {requestedMentorId === mentor.id ? 'Requested ✓' : 'Request Mentor'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Global Jobs */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center space-x-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search jobs by title, hospital, or city..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                className="w-full text-xs bg-transparent outline-none"
              />
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto">
              {['All', 'USA', 'United Kingdom', 'Australia', 'Philippines'].map((country) => (
                <button
                  key={country}
                  onClick={() => setSelectedCountryFilter(country)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                    selectedCountryFilter === country
                      ? 'bg-blue-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-extrabold text-sm text-slate-900">{job.title}</h4>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                      {job.visaStatus}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    {job.institution} • {job.location}, {job.country}
                  </div>
                  <div className="text-xs font-bold text-teal-800">
                    Salary: {job.salaryRange}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Requirements: {job.qualifications.join(' • ')}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <button
                    onClick={onOpenSubscription}
                    className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs cursor-pointer flex items-center space-x-1.5"
                  >
                    <span>Apply / View Sponsor</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <span className="block text-[10px] text-slate-400 mt-1">{job.postedDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Scholarships */}
      {activeTab === 'scholarships' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MOCK_SCHOLARSHIPS.map((sch) => (
            <div key={sch.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {sch.eligibleLevel}
                </span>
                <h4 className="font-extrabold text-sm text-slate-900 mt-2">{sch.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{sch.awardingBody}</p>

                <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl text-xs text-purple-950 my-3">
                  <strong>Grant Coverage:</strong> {sch.coverage}
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  <span className="font-bold text-slate-800 text-[11px]">Key Eligibility Criteria:</span>
                  <ul className="list-disc list-inside text-[11px] space-y-0.5">
                    {sch.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">Deadline: {sch.deadline}</span>
                <a
                  href={sch.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-800 font-bold hover:underline flex items-center space-x-1"
                >
                  <span>Guidelines</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Journals & Clinical Evidence */}
      {activeTab === 'journals' && (
        <div className="space-y-4">
          {MOCK_JOURNAL_ALERTS.map((j) => (
            <div key={j.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {j.journalName} (Impact Factor: {j.impactFactor})
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-1">{j.articleTitle}</h4>
                  <span className="text-xs text-slate-500">{j.authors} • {j.publishedDate}</span>
                </div>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {j.evidenceTier}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <strong>Structured Abstract Summary:</strong> {j.abstractSummary}
              </p>

              <div className="text-[11px] text-slate-500 font-mono">
                DOI: {j.doi}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
