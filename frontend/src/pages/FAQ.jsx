import BackButton from '../components/BackButton'
import Card from '../components/Card'
import { HelpCircle, ChevronDown } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  {
    q: 'What does HIMTI BINUS stand for?',
    a: 'HIMTI BINUS stands for Himpunan Mahasiswa Teknik Informatika Universitas Bina Nusantara. It is the official student body for Informatics Engineering students at BINUS University, founded in 1992 by Bapak Ir. Toto Widyanto, MSc.',
  },
  {
    q: 'How many commissions and divisions are in HIMTI?',
    a: 'HIMTI has 4 commissions, each with 2 divisions:\n\nKomisi 1 — Education: Academic Event, Responsi\nKomisi 2 — Relation Expansion: Publication & Marketing, HIMTI Care\nKomisi 3 — Research & Development: Web Development, Creative & Design\nKomisi 4 — Resource & Development: Supervisor, Human Resource Development',
  },
  {
    q: 'Why should I join HIMTI as an activist?',
    a: 'Joining HIMTI gives you the opportunity to expand your network, develop both soft and hard skills, learn time management, and gain invaluable organizational experience. Many alumni credit HIMTI as the highlight of their university life and a key factor in their career success.',
  },
  {
    q: 'Will joining HIMTI interfere with my studies?',
    a: 'Not if you manage your time well. HIMTI activities are designed to complement your academic journey, not hinder it. Good time management between academics, organization, and personal life is a skill you will develop here.',
  },
  {
    q: 'What is the selection process like?',
    a: 'The selection process includes submitting an application with your personal data, GPA, division preferences (up to 3 priorities with reasons), motivation, skills, and organizational experience. You also need to submit a commitment letter with a Rp5,000 stamp and signature. Admin will review and either approve or reject your application.',
  },
  {
    q: 'Can I apply to multiple divisions?',
    a: 'Yes. You can choose up to 3 divisions ranked by priority. Each priority requires its own reason explaining why you are interested in that specific division. Make sure your choices are genuine and well-thought-out.',
  },
  {
    q: 'What is the motto of HIMTI?',
    a: 'The motto of HIMTI is "One Family One Goal", reflecting the spirit of togetherness and shared purpose among all members across all commissions and divisions.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <div className="min-h-screen relative py-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-white/[2%] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4">
        <BackButton to="/" label="Back to Home" />

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-zinc-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Frequently Asked Questions</h1>
            <p className="text-sm text-zinc-500">Everything you need to know about HIMTI</p>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <Card key={i} className="overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-white/[2%]"
              >
                <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                <ChevronDown className={`h-4 w-4 text-zinc-500 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-5 animate-slide-in">
                  <div className="border-t border-white/[6%] pt-4">
                    <p className="text-sm text-zinc-400 whitespace-pre-line">{faq.a}</p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}