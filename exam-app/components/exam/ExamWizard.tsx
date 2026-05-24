'use client'

import { useState } from 'react'
import { Kazanim, Question } from '@/types'
import { StepSinif } from './steps/StepSinif'
import { StepDers } from './steps/StepDers'
import { StepYaziliBicimi, YaziliBicimi } from './steps/StepYaziliBicimi'
import { StepKonu } from './steps/StepKonu'
import { StepKazanim } from './steps/StepKazanim'
import { StepUret } from './steps/StepUret'
import { ChevronRight, ChevronLeft } from 'lucide-react'

type Step = 'sinif' | 'ders' | 'bicim' | 'konu' | 'kazanim' | 'uret'

const PREV_STEP: Record<Step, Step> = {
  sinif: 'sinif',
  ders: 'sinif',
  bicim: 'ders',
  konu: 'bicim',
  kazanim: 'konu',
  uret: 'kazanim',
}

interface Props {
  onQuestionsChange: (questions: Question[]) => void
  allQuestions: Question[]
}

export function ExamWizard({ onQuestionsChange, allQuestions }: Props) {
  const [step, setStep] = useState<Step>('sinif')
  const [sinif, setSinif] = useState<number | null>(null)
  const [ders, setDers] = useState<string | null>(null)
  const [bicim, setBicim] = useState<YaziliBicimi | null>(null)
  const [konu, setKonu] = useState<string | null>(null)
  const [kazanim, setKazanim] = useState<Kazanim | null>(null)
  const [lastAdded, setLastAdded] = useState(0)

  const goTo = (s: Step) => {
    if (s === 'sinif') { setSinif(null); setDers(null); setBicim(null); setKonu(null); setKazanim(null) }
    if (s === 'ders') { setDers(null); setBicim(null); setKonu(null); setKazanim(null) }
    if (s === 'bicim') { setBicim(null); setKonu(null); setKazanim(null) }
    if (s === 'konu') { setKonu(null); setKazanim(null) }
    if (s === 'kazanim') setKazanim(null)
    setLastAdded(0)
    setStep(s)
  }

  const handleGenerated = (questions: Question[]) => {
    onQuestionsChange([...allQuestions, ...questions])
    setLastAdded(questions.length)
    setStep('kazanim')
    setKazanim(null)
  }

  const BICIM_LABEL: Record<YaziliBicimi, string> = { test: 'Test', klasik: 'Klasik Yazılı', karma: 'Karma' }

  const breadcrumbs: { label: string; step: Step }[] = [
    ...(sinif ? [{ label: `${sinif}. Sınıf`, step: 'sinif' as Step }] : []),
    ...(ders ? [{ label: ders, step: 'ders' as Step }] : []),
    ...(bicim ? [{ label: BICIM_LABEL[bicim], step: 'bicim' as Step }] : []),
    ...(konu ? [{ label: konu, step: 'konu' as Step }] : []),
    ...(kazanim ? [{ label: kazanim.code, step: 'kazanim' as Step }] : []),
  ]

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center flex-wrap gap-1 text-sm">
          <button onClick={() => goTo('sinif')} className="text-gray-400 hover:text-blue-600 transition-colors">
            Başlangıç
          </button>
          {breadcrumbs.map((b, i) => (
            <span key={b.step} className="flex items-center gap-1">
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              {i < breadcrumbs.length - 1 ? (
                <button onClick={() => goTo(b.step)} className="text-gray-500 hover:text-blue-600 transition-colors">
                  {b.label}
                </button>
              ) : (
                <span className="font-semibold text-gray-800">{b.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Geri butonu */}
      {step !== 'sinif' && (
        <button
          onClick={() => goTo(PREV_STEP[step])}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Geri
        </button>
      )}

      {/* Kazanım eklendi mesajı */}
      {lastAdded > 0 && step === 'kazanim' && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
          <span className="font-semibold">{lastAdded} soru eklendi.</span>
          <span className="text-green-600">Başka bir kazanım seçebilirsiniz.</span>
        </div>
      )}

      {/* Adım içerikleri */}
      {step === 'sinif' && (
        <StepSinif onSelect={v => { setSinif(v); setStep('ders') }} />
      )}
      {step === 'ders' && sinif && (
        <StepDers sinif={sinif} onSelect={v => { setDers(v); setStep('bicim') }} />
      )}
      {step === 'bicim' && sinif && ders && (
        <StepYaziliBicimi sinif={sinif} ders={ders} onSelect={v => { setBicim(v); setStep('konu') }} />
      )}
      {step === 'konu' && sinif && ders && (
        <StepKonu sinif={sinif} ders={ders} onSelect={v => { setKonu(v); setStep('kazanim') }} />
      )}
      {step === 'kazanim' && konu && (
        <StepKazanim konu={konu} onSelect={v => { setKazanim(v); setStep('uret') }} />
      )}
      {step === 'uret' && kazanim && bicim && (
        <StepUret kazanim={kazanim} yaziliBicimi={bicim} onGenerated={handleGenerated} />
      )}
    </div>
  )
}
