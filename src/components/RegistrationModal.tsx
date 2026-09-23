import React, { useState } from 'react';
import { RegisteredTeam, UserSession } from '../types';
import { X, CheckCircle, KeyRound, Phone, Mail, Users, AlertCircle, ArrowRight, Eye, EyeOff, Building, CheckCircle2 } from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (newTeam: RegisteredTeam, session: UserSession) => void;
  onSwitchToLogin?: () => void;
  overallBudget?: number;
  isDarkMode: boolean;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
  onSwitchToLogin,
  overallBudget = 1000000,
  isDarkMode,
}) => {
  const [teamName, setTeamName] = useState('');
  const [collegeOrDept, setCollegeOrDept] = useState('');
  const [memberCount, setMemberCount] = useState<number>(3);
  const [memberNames, setMemberNames] = useState<string[]>(['', '', '']);
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [registeredSuccessTeam, setRegisteredSuccessTeam] = useState<RegisteredTeam | null>(null);

  if (!isOpen) return null;

  const handleMemberCountChange = (count: number) => {
    setMemberCount(count);
    const updated = [...memberNames];
    if (count > updated.length) {
      while (updated.length < count) {
        updated.push('');
      }
    } else {
      updated.splice(count);
    }
    setMemberNames(updated);
  };

  const handleMemberNameChange = (idx: number, val: string) => {
    const updated = [...memberNames];
    updated[idx] = val;
    setMemberNames(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim()) {
      setErrorMsg('Please enter a team name.');
      return;
    }

    const filledMembers = memberNames.filter((m) => m.trim().length > 0);
    if (filledMembers.length < 2) {
      setErrorMsg('Please provide at least 2 team member names (2–4 members allowed).');
      return;
    }

    if (!leaderEmail.trim() || !leaderEmail.includes('@')) {
      setErrorMsg('Please enter a valid leader email address.');
      return;
    }

    if (!leaderPhone.trim() || leaderPhone.length < 8) {
      setErrorMsg('Please enter a valid leader contact phone number.');
      return;
    }

    if (!password || password.length < 4) {
      setErrorMsg('Password must be at least 4 characters for team login.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    const teamId = `GPA-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    // Participants start with zero items in their portfolio
    const newTeam: RegisteredTeam = {
      id: teamId,
      teamName: teamName.trim(),
      collegeOrDept: collegeOrDept.trim() || 'College / Department',
      memberNames: filledMembers,
      leaderEmail: leaderEmail.trim().toLowerCase(),
      leaderPhone: leaderPhone.trim(),
      password: password,
      registeredAt: nowStr,
      role: 'participant',
      status: 'approved',
      fictionalBudget: overallBudget,
      draftedResourceIds: [],
    };

    setRegisteredSuccessTeam(newTeam);
    setErrorMsg('');

    // Persist immediately to localStorage as resilient fail-safe
    try {
      const existingRaw = localStorage.getItem('suc_registered_teams');
      let existingList: RegisteredTeam[] = [];
      if (existingRaw) {
        try {
          existingList = JSON.parse(existingRaw);
        } catch {
          existingList = [];
        }
      }
      const filtered = Array.isArray(existingList)
        ? existingList.filter((t) => t.id !== newTeam.id && t.teamName.toLowerCase() !== newTeam.teamName.toLowerCase())
        : [];
      const updatedList = [newTeam, ...filtered];
      localStorage.setItem('suc_registered_teams', JSON.stringify(updatedList));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('suc_teams_sync', { detail: newTeam }));
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('suc_teams_channel');
        bc.postMessage({ type: 'TEAM_REGISTERED', team: newTeam });
        bc.close();
      }
    } catch (e) {
      console.error('Storage write error during registration:', e);
    }

    // Direct asynchronous post to server API
    fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTeam),
    }).catch((err) => console.warn('Server registration sync warning:', err));

    // Trigger registration success and login session with strict participant role
    onRegisterSuccess(newTeam, {
      isLoggedIn: true,
      email: newTeam.leaderEmail,
      role: 'participant',
      teamName: newTeam.teamName,
      teamId: newTeam.id,
    });
  };

  const handleClose = () => {
    setRegisteredSuccessTeam(null);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        className={`relative w-full max-w-xl rounded-2xl p-6 sm:p-8 border shadow-2xl my-8 max-h-[90vh] overflow-y-auto ${
          isDarkMode
            ? 'bg-[#04130d] border-emerald-500/40 text-slate-200'
            : 'bg-white border-emerald-300 text-slate-800'
        }`}
      >
        <button
          type="button"
          onClick={handleClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-colors cursor-pointer ${
            isDarkMode
              ? 'bg-emerald-950/60 text-slate-400 hover:text-white border border-emerald-900'
              : 'bg-emerald-50 text-slate-500 hover:text-slate-800 border border-emerald-200'
          }`}
          aria-label="Close Registration Dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {registeredSuccessTeam ? (
          /* Clean Confirmation Screen */
          <div className="text-center py-6 space-y-5">
            <div
              className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${
                isDarkMode
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
                  : 'bg-emerald-50 border border-emerald-200 text-emerald-600'
              }`}
            >
              <CheckCircle className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase">
                REGISTRATION CONFIRMED
              </span>
              <h3
                className={`font-['Chakra_Petch'] font-black text-2xl sm:text-3xl uppercase mt-3 mb-1.5 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                TEAM {registeredSuccessTeam.teamName} ENROLLED!
              </h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto font-sans leading-relaxed">
                Your team is registered for <strong>Green Premier League</strong> on <strong>24 September 2026</strong> at <strong>Gallery Hall III, Block V</strong>.
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border text-left max-w-md mx-auto text-xs font-mono space-y-2 ${
                isDarkMode ? 'bg-[#02180e] border-emerald-900' : 'bg-emerald-50/60 border-emerald-200'
              }`}
            >
              <div className="flex justify-between pb-1.5 border-b border-emerald-950">
                <span className="text-slate-400">Team ID:</span>
                <span className="font-bold text-emerald-400">{registeredSuccessTeam.id}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-emerald-950">
                <span className="text-slate-400">Leader Email:</span>
                <span className="text-slate-200">{registeredSuccessTeam.leaderEmail}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-emerald-950">
                <span className="text-slate-400">Base Budget:</span>
                <span className="font-bold text-emerald-400">₹{overallBudget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Event:</span>
                <span className="text-emerald-400 font-bold">Green Premier League</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full max-w-md py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Chakra_Petch'] font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              <span>ENTER LEAGUE ARENA & CATALOG</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Registration Form */
          <div>
            <div className="mb-6 flex items-start gap-3">
              <img
                src="/nss-logo.svg"
                alt="NSS Logo"
                className="w-10 h-10 object-contain rounded-full shadow-sm shrink-0 border border-emerald-500/40 mt-1"
              />
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                  OFFICIAL PARTICIPANT ENROLLMENT // GREEN PREMIER LEAGUE
                </span>
                <h3
                  className={`font-['Chakra_Petch'] font-bold text-2xl uppercase ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  REGISTER YOUR TEAM
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Teams of 2–4 students receive a base budget of ₹{overallBudget.toLocaleString()} on league day.
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 uppercase block mb-1">
                  Team Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Green Strategists"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:border-emerald-400 ${
                    isDarkMode ? 'bg-[#02180e] border-emerald-900 text-white' : 'bg-white border-emerald-300'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 uppercase block mb-1">
                  Department / College (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Department of Sciences / Commerce"
                  value={collegeOrDept}
                  onChange={(e) => setCollegeOrDept(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:border-emerald-400 ${
                    isDarkMode ? 'bg-[#02180e] border-emerald-900 text-white' : 'bg-white border-emerald-300'
                  }`}
                />
              </div>

              {/* Members */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono text-slate-400 uppercase">
                    Team Members (2–4 Students) *
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[2, 3, 4].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => handleMemberCountChange(cnt)}
                        className={`w-6 h-6 rounded text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                          memberCount === cnt
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-emerald-950/60 text-slate-400 hover:text-white border border-emerald-900'
                        }`}
                      >
                        {cnt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {memberNames.map((name, idx) => (
                    <input
                      key={idx}
                      type="text"
                      required={idx < 2}
                      placeholder={idx === 0 ? 'Member 1 (Team Leader Name) *' : `Member ${idx + 1} Name`}
                      value={name}
                      onChange={(e) => handleMemberNameChange(idx, e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:border-emerald-400 ${
                        isDarkMode ? 'bg-[#02180e] border-emerald-900 text-white' : 'bg-white border-emerald-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase block mb-1">
                    Leader Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="leader@college.edu"
                    value={leaderEmail}
                    onChange={(e) => setLeaderEmail(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:border-emerald-400 ${
                      isDarkMode ? 'bg-[#02180e] border-emerald-900 text-white' : 'bg-white border-emerald-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase block mb-1">
                    Leader Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={leaderPhone}
                    onChange={(e) => setLeaderPhone(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:border-emerald-400 ${
                      isDarkMode ? 'bg-[#02180e] border-emerald-900 text-white' : 'bg-white border-emerald-300'
                    }`}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase block mb-1">
                    Create Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Min 4 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:border-emerald-400 pr-9 ${
                        isDarkMode ? 'bg-[#02180e] border-emerald-900 text-white' : 'bg-white border-emerald-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase block mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:border-emerald-400 ${
                      isDarkMode ? 'bg-[#02180e] border-emerald-900 text-white' : 'bg-white border-emerald-300'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Chakra_Petch'] font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 mt-4 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>CONFIRM TEAM REGISTRATION</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-emerald-950 text-center">
              <p className="text-xs text-slate-400 font-mono">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-emerald-400 hover:underline font-bold cursor-pointer"
                >
                  Sign in with Team Email
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
