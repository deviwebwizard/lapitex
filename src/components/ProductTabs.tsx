'use client';

import { useState } from 'react';
import { Specification } from '@/lib/parseSpecs';
import { ShieldCheck, ArrowRightLeft, Star } from 'lucide-react';

interface ProductTabsProps {
  description: string;
  specifications: Specification[];
  condition: string;
}

export function ProductTabs({ description, specifications, condition }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'warranty' | 'reviews'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'specs', label: 'Specifications' },
    { id: 'warranty', label: 'Warranty & Support' },
    { id: 'reviews', label: 'Reviews' },
  ];

  return (
    <div className="mt-12 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Tab Headers */}
      <div className="flex overflow-x-auto border-b border-gray-100 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`whitespace-nowrap py-4 px-6 md:px-8 text-sm md:text-base font-bold transition-colors relative ${
              activeTab === tab.id
                ? 'text-primary'
                : 'text-gray-500 hover:text-gray-900 bg-gray-50/50 hover:bg-white'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 md:p-8 min-h-[300px]">
        {activeTab === 'overview' && (
          <div className="prose prose-sm md:prose-base max-w-none text-gray-600">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Product Overview</h3>
            <p className="whitespace-pre-wrap leading-relaxed">{description}</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                <ShieldCheck className="h-8 w-8 text-primary mb-3" />
                <h4 className="font-bold text-gray-900 mb-1">Quality Checked</h4>
                <p className="text-sm text-gray-600">Thoroughly tested by our expert technicians for optimal performance.</p>
              </div>
              <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                <ArrowRightLeft className="h-8 w-8 text-primary mb-3" />
                <h4 className="font-bold text-gray-900 mb-1">7 Days Replacement</h4>
                <p className="text-sm text-gray-600">Easy replacement if any defect is found within 7 days of delivery.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'specs' && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Technical Specifications</h3>
            <div className="rounded-2xl border border-gray-200 overflow-hidden">
              <table className="w-full text-left text-sm text-gray-600">
                <tbody>
                  {specifications.map((spec, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <th className="px-6 py-4 font-semibold text-gray-900 border-r border-gray-200 w-1/3">
                        {spec.key}
                      </th>
                      <td className="px-6 py-4">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'warranty' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Warranty & Support Details</h3>
            
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <h4 className="font-bold text-blue-900 text-lg mb-2">Standard Warranty</h4>
              <p className="text-blue-800 text-sm md:text-base leading-relaxed">
                This {condition} product comes with a <strong>{condition === 'New' ? '1 Year' : '6 Months'}</strong> standard warranty. 
                Our warranty covers any hardware defects that may occur during normal usage.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-3">What's Covered?</h4>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm md:text-base">
                <li>Motherboard and internal components</li>
                <li>Display screen (excluding physical damage or liquid spills)</li>
                <li>RAM and Storage drives</li>
                <li>Keyboard and Trackpad functionality</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-3">Support Channels</h4>
              <p className="text-gray-600 text-sm md:text-base">
                For warranty claims or technical support, please contact us at <strong>support@lapitex.com</strong> or call us at <strong>+91 6200144824</strong>.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current text-yellow-200" />
                </div>
                <span className="font-bold text-gray-900">4.2/5</span>
                <span className="text-gray-500">(12 reviews)</span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Mock Review 1 */}
              <div className="border-b border-gray-100 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      A
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Amit K.</p>
                      <p className="text-xs text-gray-500">Verified Buyer</p>
                    </div>
                  </div>
                  <div className="flex text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current text-yellow-200" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                  The product arrived in perfect condition, packaging was extremely secure. Performance is exactly as promised. Very happy with the refurbished quality.
                </p>
              </div>

              {/* Mock Review 2 */}
              <div className="border-b border-gray-100 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                      S
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Sneha R.</p>
                      <p className="text-xs text-gray-500">Verified Buyer</p>
                    </div>
                  </div>
                  <div className="flex text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                  Amazing deal! Looks brand new. Was skeptical about buying refurbished but the quality is top-notch. Fast delivery too.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
