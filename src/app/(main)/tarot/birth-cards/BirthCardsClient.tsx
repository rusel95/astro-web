'use client';

import FeaturePageLayout from '@/components/feature/FeaturePageLayout';
import AnalysisSection from '@/components/feature/AnalysisSection';

export default function BirthCardsClient() {
  return (
    <FeaturePageLayout
      title="Карти народження"
      description="Карта особистості та карта душі на основі вашої дати народження."
      apiEndpoint="/api/tarot/birth-cards"
      formVariant="basic"
    >
      {(data) => {
        const bc = data.birthCards as any;
        return (
          <div className="space-y-6">
            {bc && (
              <>
                {/* Personality card */}
                {bc.personality_card && (
                  <div className="rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <h3 className="text-sm text-white/40 uppercase tracking-wider mb-3">Карта особистості</h3>
                    <div className="flex gap-4 items-start">
                      {(bc.personality_card.image_url || bc.personality_card.imageUrl) && (
                        <img
                          src={bc.personality_card.image_url || bc.personality_card.imageUrl}
                          alt={bc.personality_card.name_uk || bc.personality_card.name}
                          className="w-20 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-white text-lg">
                          {bc.personality_card.name_uk || bc.personality_card.name}
                        </p>
                        {bc.personality_card.meaning && (
                          <p className="text-sm text-white/60 mt-1">{bc.personality_card.meaning}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Soul card */}
                {bc.soul_card && bc.soul_card.name !== bc.personality_card?.name && (
                  <div className="rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <h3 className="text-sm text-white/40 uppercase tracking-wider mb-3">Карта душі</h3>
                    <div className="flex gap-4 items-start">
                      {(bc.soul_card.image_url || bc.soul_card.imageUrl) && (
                        <img
                          src={bc.soul_card.image_url || bc.soul_card.imageUrl}
                          alt={bc.soul_card.name_uk || bc.soul_card.name}
                          className="w-20 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-white text-lg">
                          {bc.soul_card.name_uk || bc.soul_card.name}
                        </p>
                        {bc.soul_card.meaning && (
                          <p className="text-sm text-white/60 mt-1">{bc.soul_card.meaning}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Full data */}
                {!bc.personality_card && (
                  <AnalysisSection title="Карти народження" data={bc as Record<string, unknown>} />
                )}
              </>
            )}
          </div>
        );
      }}
    </FeaturePageLayout>
  );
}
