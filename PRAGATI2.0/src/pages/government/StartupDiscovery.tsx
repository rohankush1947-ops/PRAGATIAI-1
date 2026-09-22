import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePragati } from '../../context/PragatiContext';
import { 
  Search, 
  Filter, 
  Building2, 
  MapPin, 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  ExternalLink,
  PlusCircle,
  Cpu
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

export const StartupDiscovery: React.FC = () => {
  const { startups, registerStartup, addToast } = usePragati();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedReadiness, setSelectedReadiness] = useState('All');

  // Modal State
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    domain: 'Smart Infrastructure & Computer Vision',
    techStack: 'Computer Vision, Edge AI, Python',
    location: 'Bengaluru, Karnataka',
    completedPilotsCount: 2,
    overview: ''
  });

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('error', 'Validation Error', 'Startup name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const techArray = formData.techStack
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      await registerStartup({
        name: formData.name.trim(),
        tagline: formData.tagline.trim() || `${formData.name} - Deep-Tech Innovations`,
        domain: formData.domain,
        techStack: techArray.length > 0 ? techArray : ['Artificial Intelligence'],
        location: formData.location.trim() || 'India',
        completedPilotsCount: Number(formData.completedPilotsCount) || 0,
        overview: formData.overview.trim() || `${formData.name} builds solutions in ${formData.domain}.`,
        pilotReadiness: 'High',
        eligibilityStatus: 'Eligible',
        certifications: ['DPIIT Recognized', 'Make in India Certified']
      });

      setIsRegisterOpen(false);
      setFormData({
        name: '',
        tagline: '',
        domain: 'Smart Infrastructure & Computer Vision',
        techStack: 'Computer Vision, Edge AI, Python',
        location: 'Bengaluru, Karnataka',
        completedPilotsCount: 2,
        overview: ''
      });
    } catch (err: any) {
      console.error('Failed to register startup:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStartups = startups.filter(st => {
    const matchesSearch = 
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDomain = selectedDomain === 'All' || st.domain.includes(selectedDomain);
    const matchesReadiness = selectedReadiness === 'All' || st.pilotReadiness === selectedReadiness;

    return matchesSearch && matchesDomain && matchesReadiness;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 mb-1">
            <Search className="w-4 h-4" />
            <span>Deep-Tech Ecosystem Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Startup Discovery
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Discover vetted Indian deep-tech startups across computer vision, agritech, healthcare, and urban IoT.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-enroll-startup"
            onClick={() => setIsRegisterOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-sky-50 border border-sky-300 text-xs font-semibold text-sky-700 flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Enroll Startup</span>
          </button>

          <Link
            to="/government/ai-matching"
            className="px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-600 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Matching Matrix</span>
          </Link>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search startups by technology, domain or capability (e.g. YOLO, Computer Vision, Drones, IoT)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="gov-input pl-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <Filter className="w-3.5 h-3.5 text-sky-700" />
            <span>Domain:</span>
          </div>
          {['All', 'Infrastructure', 'Agriculture', 'Healthcare', 'Urban', 'EdTech'].map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedDomain === dom
                  ? 'bg-sky-700 text-white font-semibold shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {dom}
            </button>
          ))}

          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium ml-auto">
            <span>Readiness:</span>
            <select
              value={selectedReadiness}
              onChange={(e) => setSelectedReadiness(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800"
            >
              <option value="All">All Stages</option>
              <option value="High">High Readiness</option>
              <option value="Medium">Medium Readiness</option>
            </select>
          </div>
        </div>
      </div>

      {/* STARTUP CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStartups.map((st) => (
          <div
            key={st.id}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-sky-500 hover:shadow-md transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              {/* Top row */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                      {st.name}
                    </h3>
                  </div>
                  <p className="text-xs text-sky-700 font-semibold mt-0.5">{st.domain}</p>
                </div>
                <StatusBadge status={st.eligibilityStatus} />
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                {st.tagline}
              </p>

              {/* Meta stats */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] mb-4">
                <div>
                  <span className="text-slate-500 block">Pilot Readiness:</span>
                  <span className={`font-bold ${st.pilotReadiness === 'High' ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {st.pilotReadiness} Readiness
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Pilots Completed:</span>
                  <span className="font-bold text-slate-900">{st.completedPilotsCount} State Pilots</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Founded:</span>
                  <span className="font-semibold text-slate-900">{st.foundedYear}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Location:</span>
                  <span className="font-semibold text-slate-900 truncate block">{st.location}</span>
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {st.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
              <Link
                to={st.id === 'startup-roadvision' ? '/government/ai-matching' : `/startup/profile`}
                className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1"
              >
                <span>Check Match Score</span>
                <Sparkles className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/startup/profile"
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-xs font-medium text-slate-700 shadow-sm transition-colors"
              >
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* REGISTER STARTUP MODAL */}
      <Modal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        title="Enroll Deep-Tech Startup"
        subtitle="Register a qualified Indian startup profile into the PragatiAI discovery & matching ecosystem."
        maxWidth="2xl"
      >
        <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Startup Legal / Operating Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. AgroSense Technologies"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="gov-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Primary Innovation Domain *</label>
              <select
                value={formData.domain}
                onChange={e => setFormData(prev => ({ ...prev, domain: e.target.value }))}
                className="gov-select"
              >
                <option value="Smart Infrastructure & Computer Vision">Smart Infrastructure & Computer Vision</option>
                <option value="AI + Agriculture">AI + Agriculture</option>
                <option value="Healthcare AI & Hospital Operations">Healthcare AI & Hospital Operations</option>
                <option value="IoT + AI Urban Infrastructure">IoT + AI Urban Infrastructure</option>
                <option value="EdTech + AI">EdTech + AI</option>
                <option value="Civic Tech & Document Intelligence">Civic Tech & Document Intelligence</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Headquarters Location</label>
              <input
                type="text"
                placeholder="e.g. Hyderabad, Telangana"
                value={formData.location}
                onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="gov-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">One-Line Tagline</label>
            <input
              type="text"
              placeholder="e.g. Hyperspectral Drone Scouting & Agronomic AI"
              value={formData.tagline}
              onChange={e => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
              className="gov-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Core Tech Stack (Comma separated) *</label>
              <input
                type="text"
                required
                placeholder="e.g. Drone AI, PyTorch, Hyperspectral, Edge"
                value={formData.techStack}
                onChange={e => setFormData(prev => ({ ...prev, techStack: e.target.value }))}
                className="gov-input"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Completed Public/Commercial Pilots</label>
              <input
                type="number"
                min="0"
                max="50"
                value={formData.completedPilotsCount}
                onChange={e => setFormData(prev => ({ ...prev, completedPilotsCount: Number(e.target.value) }))}
                className="gov-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Overview & Technical Capabilities</label>
            <textarea
              rows={3}
              placeholder="Describe core IP, models, sensors, and key public deployment strengths..."
              value={formData.overview}
              onChange={e => setFormData(prev => ({ ...prev, overview: e.target.value }))}
              className="gov-input font-normal"
            />
          </div>

          <div className="p-3 rounded-lg bg-sky-950/40 border border-sky-800/40 text-[11px] text-sky-200">
            ✓ Profile will immediately qualify for automated DPIIT statutory eligibility and becomes accessible to the dynamic AI matching engine.
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsRegisterOpen(false)}
              className="gov-button-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="gov-button-primary"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Enrolling...' : 'Enroll Startup'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
