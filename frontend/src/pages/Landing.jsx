import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'
import TypewriterText from '../components/TypewriterText'
import AnimatedCounter from '../components/AnimatedCounter'
import {
  Quote,
  Sparkles,
  GraduationCap,
  Globe,
  ExternalLink,
  Mail,
  MapPin,
  ArrowUpRight,
} from 'lucide-react'

export default function Landing() {
  const { isAuth, user } = useAuth()

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-white/[2%] rounded-full blur-[120px]" />
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute top-[30%] right-[-300px] w-[500px] h-[500px] bg-zinc-700/[3%] rounded-full blur-[100px]" />
        <div className="absolute bottom-[-100px] left-[20%] w-[400px] h-[400px] bg-white/[1.5%] rounded-full blur-[80px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[3%]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10">
        {/* ===== HERO ===== */}
        <section className="max-w-5xl mx-auto px-4 pt-28 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[6%] border border-white/[8%] text-xs text-zinc-400 mb-10 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-zinc-300" />
            HIMTI BINUS University — Since 2005
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-10 min-h-[100px]">
            <TypewriterText lines={['Ready to Build the Future?', 'Innovate, Integrate, Inspire.', 'Code the Future, Today.']} />
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up">
            HIMTI is the official student body for Informatics Engineering at BINUS University.
            Join us to grow, network, and build your future in technology.
          </p>

          <div className="flex items-center justify-center gap-4 animate-fade-in-up stagger-2">
            <RouterLink
              to={isAuth ? '/apply' : '/register'}
              className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 font-medium rounded-xl shadow-lg shadow-white/10 hover:shadow-white/20 hover:bg-zinc-100 transition-all duration-300 text-sm"
            >
              {isAuth ? 'Apply Now' : 'Join HIMTI'}
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </RouterLink>
            <a
              href="#about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800/60 text-zinc-100 font-medium rounded-xl border border-white/10 hover:bg-zinc-700/60 hover:border-white/20 transition-all duration-300 text-sm"
            >
              Learn More
            </a>
          </div>
        </section>

        {/* ===== ABOUT / BENTO GRID ===== */}
        <section id="about" className="max-w-6xl mx-auto px-4 pb-24">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="md:col-span-1 md:row-span-2 p-8 flex flex-col justify-between animate-fade-in-up hover:border-blue-500/30 transition-all duration-500">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                  <GraduationCap className="h-5 w-5 text-zinc-200" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">What is HIMTI?</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  HIMTI (Himpunan Mahasiswa Teknik Informatika) is the official
                  student body for Informatics Engineering at BINUS University.
                  We organize workshops, seminars, and bootcamps to bridge
                  academic knowledge with industry practice.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/[6%]">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">Founded</span>
                  <span className="text-white font-medium">2005</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-zinc-500">Members</span>
                  <span className="text-white font-medium">5,000+</span>
                </div>
              </div>
            </Card>

            <Card className="md:col-span-2 p-8 flex items-start gap-4 animate-fade-in-up stagger-1 hover:border-blue-500/30 transition-all duration-500">
              <Quote className="h-8 w-8 text-zinc-600 shrink-0 mt-1" />
              <div>
                <p className="text-lg text-zinc-200 leading-relaxed italic">
                  "Technology is best when it brings people together. HIMTI is
                  where future innovators connect, learn, and grow."
                </p>
                <p className="text-sm text-zinc-500 mt-4">— HIMTI BINUS University</p>
              </div>
            </Card>

            <Card className="md:col-span-1 p-8 animate-fade-in-up stagger-2 hover:border-blue-500/30 transition-all duration-500">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white"><AnimatedCounter target={10} suffix="+" /></p>
                  <p className="text-xs text-zinc-500 mt-1">Events / Year</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white"><AnimatedCounter target={5000} duration={1200} suffix="+" /></p>
                  <p className="text-xs text-zinc-500 mt-1">Members</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white"><AnimatedCounter target={15} suffix="+" /></p>
                  <p className="text-xs text-zinc-500 mt-1">Years Active</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">∞</p>
                  <p className="text-xs text-zinc-500 mt-1">Opportunities</p>
                </div>
              </div>
            </Card>

            <Card className="md:col-span-1 p-8 animate-fade-in-up stagger-3 hover:border-blue-500/30 transition-all duration-500">
              <Globe className="h-5 w-5 text-zinc-300 mb-3" />
              <h3 className="text-sm font-semibold text-white mb-2">Our Vision</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Empowering students with technology skills that matter in the
                real world. Building a community of lifelong learners.
              </p>
            </Card>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="border-t border-white/[6%] bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 py-14">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <img src="/images/himti-icon.svg" alt="HIMTI" className="w-8 h-8 object-contain" />
                  <span className="font-semibold text-white text-lg">HIMTI</span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Himpunan Mahasiswa Teknik Informatika<br />BINUS University
                </p>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
                <div className="space-y-2.5 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                    himti@binus.ac.id
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                    BINUS Anggrek, Jakarta
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
                <div className="space-y-2 text-xs">
                  <RouterLink to="/" className="block text-zinc-500 hover:text-white transition-colors">Home</RouterLink>
                  <RouterLink to="/login" className="block text-zinc-500 hover:text-white transition-colors">Sign In</RouterLink>
                  <RouterLink to="/register" className="block text-zinc-500 hover:text-white transition-colors">Register</RouterLink>
                  {isAuth && user?.role === 'admin' && (
                    <RouterLink to="/admin" className="block text-zinc-500 hover:text-white transition-colors">Admin</RouterLink>
                  )}
                </div>
              </div>

              {/* Follow Us */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Follow Us</h4>
                <div className="flex flex-col gap-2">
                  <a href="https://instagram.com/himti_binus" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors">
                    <ExternalLink className="h-3.5 w-3.5 text-zinc-600 shrink-0" /> Instagram
                  </a>
                  <a href="https://ofog.himtibinus.or.id/" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors">
                    <ExternalLink className="h-3.5 w-3.5 text-zinc-600 shrink-0" /> Official Website
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-white/[6%] text-center text-xs text-zinc-600">
              &copy; {new Date().getFullYear()} HIMTI BINUS University. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}