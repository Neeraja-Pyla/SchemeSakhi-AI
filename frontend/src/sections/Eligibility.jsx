
import { useState } from 'react'

const API_URL = (
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001'
).replace(/\/$/, '')

const schemes = [
  {
    id: 'PM-KISAN',
    name: 'PM-KISAN Samman Nidhi',
    category: 'Farmer Support',
    description:
      'Financial support scheme for eligible landholding farmer families.',
    purpose:
      'Provides eligible farmer families with financial assistance through direct benefit transfers.',
    audience: 'Eligible landholding farmer families.',
    portal: 'https://pmkisan.gov.in/',
    available: true,
  },
  {
    id: 'NSP',
    name: 'National Scholarship Portal',
    category: 'Education',
    description:
      'A platform to discover and apply for government scholarship opportunities.',
    purpose:
      'Helps students find scholarship schemes offered by different government departments.',
    audience:
      'Students who meet the eligibility conditions of individual scholarships.',
    portal: 'https://scholarships.gov.in/',
    available: false,
  },
  {
    id: 'PM-JAY',
    name: 'Ayushman Bharat PM-JAY',
    category: 'Healthcare',
    description:
      'Government-funded health coverage for eligible families.',
    purpose:
      'Provides eligible beneficiaries access to cashless hospital care at empanelled hospitals, subject to scheme rules.',
    audience: 'Families identified under the applicable eligibility criteria.',
    portal: 'https://pmjay.gov.in/',
    available: false,
  },
  {
    id: 'NSAP',
    name: 'National Social Assistance Programme',
    category: 'Social Welfare',
    description:
      'Social assistance programmes for eligible vulnerable individuals.',
    purpose:
      'Supports eligible elderly people, widows and persons with disabilities through applicable assistance programmes.',
    audience: 'Eligible beneficiaries under the relevant NSAP components.',
    portal: 'https://nsap.nic.in/',
    available: false,
  },
]

function Eligibility() {
  const [selectedScheme, setSelectedScheme] = useState('PM-KISAN')

  const [formData, setFormData] = useState({
    state: '',
    land: '',
    institutional: '',
    publicOffice: '',
    governmentEmployee: '',
    incomeTax: '',
    pension: '',
    professional: '',
  })

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const currentScheme = schemes.find(
    (scheme) => scheme.id === selectedScheme
  )

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  function handleSchemeChange(event) {
    setSelectedScheme(event.target.value)
    setResult(null)
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (selectedScheme !== 'PM-KISAN') return

    setLoading(true)
    setResult(null)
    setError('')

    try {
      const response = await fetch(`${API_URL}/check-eligibility`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Unable to check eligibility.')
      }

      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const selectClass =
    'w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-800 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 transition'

  const answerOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
    { value: 'unsure', label: 'Not sure' },
  ]

  const questions = [
    {
      name: 'institutional',
      label:
        'Is the agricultural land held by an institution rather than an individual farmer family?',
    },
    {
      name: 'publicOffice',
      label:
        'Does any family member fall under a specified constitutional post or elected public representative category?',
    },
    {
      name: 'governmentEmployee',
      label:
        'What is the government employment status of any family member?',
      options: [
        { value: 'no', label: 'No government employment' },
        {
          value: 'regular',
          label: 'Regular government employee / officer',
        },
        {
          value: 'mts',
          label: 'MTS / Class IV / Group D employee',
        },
        { value: 'unsure', label: 'Not sure' },
      ],
    },
    {
      name: 'incomeTax',
      label:
        'Has any family member paid income tax in the last assessment year?',
    },
    {
      name: 'pension',
      label:
        'Does any family member receive a monthly government pension of ₹10,000 or more?',
    },
    {
      name: 'professional',
      label:
        'Is any family member an actively practising registered professional, such as a doctor, lawyer, CA or architect?',
    },
  ]

  const documents = [
    'Aadhaar card of the applicant',
    'Bank passbook with account details',
    'Agricultural land ownership records',
    'Aadhaar-linked mobile number, if available',
    'Relevant identity and family details',
  ]

  const nextSteps = {
    potentially_eligible: [
      'Keep your Aadhaar, bank details and land records ready.',
      'Complete or verify your eKYC through the official PM-KISAN portal.',
      'Check that your land records and bank details are accurate.',
      'Contact your local agriculture office or Common Service Centre if you need assistance.',
    ],
    not_likely_eligible: [
      'Review the conditions marked as failed below.',
      'Check whether your family information and land records are accurate.',
      'If you believe the assessment is incorrect, contact your local agriculture office.',
    ],
    needs_verification: [
      'Review the conditions marked as needing verification.',
      'Check your official land, employment, income and pension records.',
      'Ask your local agriculture office or Common Service Centre to verify your situation.',
    ],
  }

  function getOverallStyle(status) {
    if (status === 'potentially_eligible') {
      return 'bg-green-50 text-green-800 border-green-200'
    }

    if (status === 'not_likely_eligible') {
      return 'bg-red-50 text-red-800 border-red-200'
    }

    return 'bg-yellow-50 text-yellow-800 border-yellow-200'
  }

  function getOverallLabel(status) {
    if (status === 'potentially_eligible') return '✓ Potentially Eligible'
    if (status === 'not_likely_eligible') return '✕ Not Likely Eligible'
    return '⚠ Needs Further Verification'
  }

  function getStatusStyle(status) {
    if (status === 'met') return 'bg-green-100 text-green-800'
    if (status === 'not_met') return 'bg-red-100 text-red-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  return (
    <section className="bg-[#F8FAF7] py-20 px-6" id="eligibility">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-green-700 font-semibold text-sm">
            PERSONALIZED GUIDANCE
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
            Check Your Scheme Eligibility
          </h2>

          <p className="text-gray-500 mt-4">
            Explore government schemes and understand which opportunities
            may be relevant to you.
          </p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <div>
            <label
              htmlFor="scheme"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Select Government Scheme
            </label>

            <select
              id="scheme"
              name="scheme"
              className={selectClass}
              value={selectedScheme}
              onChange={handleSchemeChange}
            >
              {schemes.map((scheme) => (
                <option key={scheme.id} value={scheme.id}>
                  {scheme.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-green-100 bg-green-50 p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-green-800">
                {currentScheme.category}
              </span>

              {currentScheme.available ? (
                <span className="text-xs font-semibold rounded-full bg-green-100 text-green-800 px-3 py-1">
                  Eligibility checker available
                </span>
              ) : (
                <span className="text-xs font-semibold rounded-full bg-amber-100 text-amber-800 px-3 py-1">
                  Eligibility checker coming soon
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              {currentScheme.name}
            </h3>

            <p className="text-sm text-gray-600">
              {currentScheme.description}
            </p>

            <div className="space-y-2 pt-2">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  What does this scheme do?
                </p>
                <p className="text-sm text-gray-600">
                  {currentScheme.purpose}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Who may benefit?
                </p>
                <p className="text-sm text-gray-600">
                  {currentScheme.audience}
                </p>
              </div>
            </div>

            <a
              href={currentScheme.portal}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-green-800 underline underline-offset-4"
            >
              Visit Official Website →
            </a>
          </div>

          {selectedScheme === 'PM-KISAN' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-bold text-lg text-gray-900">
                  PM-KISAN Eligibility Questions
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Answer the following questions to receive a preliminary
                  eligibility assessment.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your State
                </label>

                <select
                  required
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option value="">Select your state</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Does your farmer family own cultivable agricultural land
                  recorded in the state's land records?
                </label>

                <select
                  required
                  name="land"
                  value={formData.land}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option value="">Choose an answer</option>
                  {answerOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {questions.map((item) => (
                <div key={item.name}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {item.label}
                  </label>

                  <select
                    required
                    name={item.name}
                    value={formData[item.name]}
                    onChange={handleChange}
                    className={selectClass}
                  >
                    <option value="">Choose an answer</option>

                    {(item.options || answerOptions).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold transition"
              >
                {loading ? 'Checking...' : 'Check My Eligibility →'}
              </button>

              {error && (
                <p className="text-center text-sm text-red-600">
                  {error}
                </p>
              )}

              {result && (
                <div className="mt-6 space-y-6">
                  <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <h3 className="font-bold text-lg text-gray-900">
                      Your Eligibility Assessment
                    </h3>

                    <div
                      className={`mt-3 rounded-lg border p-4 ${getOverallStyle(result.result)}`}
                    >
                      <p className="font-bold">
                        {getOverallLabel(result.result)}
                      </p>

                      <p className="text-sm mt-2">{result.summary}</p>
                    </div>

                    <h4 className="font-semibold text-gray-800 mt-6 mb-3">
                      Condition-wise Results
                    </h4>

                    {result.checks?.map((check, index) => (
                      <div
                        key={index}
                        className="border-t border-gray-100 py-3"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <p className="font-medium text-sm text-gray-800">
                            {check.condition}
                          </p>

                          <span
                            className={`text-xs font-semibold rounded-full px-3 py-1 whitespace-nowrap ${getStatusStyle(check.status)}`}
                          >
                            {check.status === 'met'
                              ? 'Passed'
                              : check.status === 'not_met'
                                ? 'Failed'
                                : 'Review'}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mt-2">
                          {check.reason}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                    <h3 className="font-bold text-lg text-blue-900">
                      Your Next Steps
                    </h3>

                    <ol className="mt-3 space-y-3">
                      {(nextSteps[result.result] ||
                        nextSteps.needs_verification).map((step, index) => (
                        <li
                          key={index}
                          className="flex gap-3 text-sm text-gray-700"
                        >
                          <span className="font-bold text-blue-700">
                            {index + 1}.
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="rounded-xl border border-green-100 bg-green-50 p-5">
                    <h3 className="font-bold text-lg text-green-900">
                      Documents to Keep Ready
                    </h3>

                    <p className="text-sm text-gray-600 mt-1">
                      These documents are commonly useful during
                      verification. Authorities may request additional
                      documents.
                    </p>

                    <ul className="mt-4 space-y-3">
                      {documents.map((document, index) => (
                        <li
                          key={index}
                          className="flex gap-3 text-sm text-gray-700"
                        >
                          <span className="text-green-700 font-bold">✓</span>
                          {document}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={result.official_source}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-green-800 underline font-semibold text-sm"
                  >
                    Visit Official PM-KISAN Website →
                  </a>

                  <p className="text-xs text-gray-500">
                    {result.disclaimer}
                  </p>
                </div>
              )}

              <p className="text-xs text-gray-400 text-center">
                This is an informational pre-check, not an official
                eligibility decision. Final verification is performed by
                the government.
              </p>
            </form>
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <h3 className="font-bold text-gray-900">
                Personalized eligibility checker coming soon
              </h3>

              <p className="text-sm text-gray-700 mt-2">
                SchemeSakhi AI currently provides a working eligibility
                assessment for PM-KISAN. We have not yet implemented the
                eligibility rules for this scheme, so we won't show an
                unverified eligibility result.
              </p>

              <p className="text-sm text-gray-700 mt-3">
                You can explore the scheme using its official website and
                check its latest eligibility conditions there.
              </p>

              <a
                href={currentScheme.portal}
                target="_blank"
                rel="noreferrer"
                className="inline-flex mt-4 bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-lg font-semibold text-sm transition"
              >
                Explore Official Scheme →
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Eligibility
