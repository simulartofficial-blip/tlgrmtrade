'use client'

import { useState } from 'react'
import { Kazanim, Question } from '@/types'
import { StepSinif } from './steps/StepSinif'
import { StepDers } from './steps/StepDers'
import { StepKonu } from './steps/StepKonu'
import { StepKazanim } from './steps/StepKazanim'
import { StepUret } from './steps/StepUret'
import { ChevronRight, ChevronLeft } from 'lucide-react'

type Step = 'sinif' | 'ders' | 'konu' | 'kazanim' | 'uret'

interface Breadcrumb {
  label: string
  step: Step
}

interface Props {
  onQuestionsChange: (questions: Question[]) => void
  allQuestions: Question[]
}

export function ExamWizard({ onQuestionsChange, allQuestions }: Props) {
  const [step, setStep] = useState<Step>('sinif')
  const [sinif, setSinif] = useState<number | null>(null)
  const [ders, setDers] = useState<string | null>(null)
  const [konu, setKonu] = useState<string | null>(null)
  const [kazanim, setKazanim] = useState<Kazanim | null>(null)
  const [lastAdded, setLastAdded] = useState(0)

  const breadcrumbs: Breadcrumb[] = [
    ...(sinif ? [{ label: `${sinif}. Sınıf`, step: 'sinif' as Step }] : []),
    ...(ders ? [{ label: ders, step: 'ders' as Step }] : []),
    ...(konu ? [{ label: konu, step: 'konu' as Step }] : []),
    ...(kazanim ? [{ label: kazanim.code, step: 'kazanim' as Step }] : []),
  ]

  const goTo = (s: Step) => {
    if (s === 'sinif') { setSinif(null); setDers(null); setKonu(null); setKazanim(null) }
    if (s === 'ders') { setDers(null); setKonu(null); setKazanim(null) }
    if (s === 'konu') { setKonu(null); setKazanim(null) }
    if (s === 'kazanim') setKazanim(null)
    setStep(s)
  }

  const handleGenerated = (questions: Question[]) => {
    onQuestionsChange([...allQuestions, ...questions])
    setLastAdded(questions.length)
    setStep('kazanim')
    setKazanim(null)
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center flex-wrap gap-1 text-sm">
          <button
            onClick={() => goTo('sinif')}
            className="text-gray-400 hover:text-blue-600 transition-colors"
          >
            Başlangıç
          </button>
          {breadcrumbs.map((b, i) => (
            <span key={b.step} className="flex items-center gap-1">
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              {i < breadcrumbs.length - 1 ? (
                <button
                  onClick={() => goTo(b.step)}
                  className="text-gray-500 hover:text-blue-600 transition-colors"
                >
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
          onClick={() => {
            const prev: Record<Step, Step> = {
              ders: 'sinif', konu: 'ders', kazanim: 'konu', uret: 'kazanim', sinif: 'sinif',
            }
            goTo(prev[step])
          }}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Geri
        </button>
      )}

      {/* Başarı mesajı */}
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
        <StepDers sinif={sinif} onSelect={v => { setDers(v); setStep('konu') }} />
      )}
      {step === 'konu' && sinif && ders && (
        <StepKonu sinif={sinif} ders={ders} onSelect={v => { setKonu(v); setStep('kazanim') }} />
      )}
      {step === 'kazanim' && konu && (
        <StepKazanim konu={konu} onSelect={v => { setKazanim(v); setStep('uret') }} />
      )}
      {step === 'uret' && kazanim && (
        <StepUret kazanim={kazanim} onGenerated={handleGenerated} />
      )}
    </div>
  )
}
