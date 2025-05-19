import React, { useEffect, useState } from 'react';

const CombinedFilters = () => {
  const [progress, setProgress] = useState([]);

  const log = (msg) => {
    setProgress(prev => [...prev, msg]);
  };

  useEffect(() => {
    (async () => {
      try {
        log('1. restaurants.json 파일 로드 중');
        const resRest = await fetch('../../restaurants.json');
        if (!resRest.ok) throw new Error('restaurants.json 로드 실패');
        const restaurants = await resRest.json();
        log(`restaurants.json 로드 완료`);

        log('2. rawData.json 파일 로드 중...');
        const resRaw = await fetch('../../rawData.json');
        if (!resRaw.ok) throw new Error('rawData.json 호출 실패');
        const rawData = await resRaw.json();
        log('rawData.json 로드 완료');
        
        log('3. 광진구에서 영업 중인 업소 필터링 중');
        const selected = rawData.filter(entry => {
          const isBusiness = entry.dtlstatenm === '영업';
          const addr = entry.sitewhladdr || entry.rdnwhladdr || '';
          return isBusiness && addr.includes('서울특별시 광진구');
        });
        log(`필터링 완료: ${selected.length}개 업소 선정 완료`);

        log('4. 음식점 데이터와 매칭 및 태그 추가 중');
        const isMatch = (name1, name2) => {
          const a = name1.trim();
          const b = name2.trim();
          return a.includes(b) || b.includes(a);
        };

        const matched = [];
        for (const rest of restaurants) {
          const match = selected.find(sel => isMatch(rest.name, sel.bplcnm));
          if (match) {
            rest.majorTag = match.uptaenm || '알 수 없음';
            matched.push(rest);
          }
        }
        log(`매칭 완료: ${matched.length}개 음식점 태깅 완료`);

        log('5. restaurantsIdentified.json 파일 생성 중');
        const blob = new Blob([JSON.stringify(matched, null, 2)], { type: 'application/json; charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'restaurantsIdentified.json';
        a.click();
        URL.revokeObjectURL(url);
        log('restaurantsIdentified.json 저장 완료');
      } catch (err) {
        console.error(err);
        log(`오류 발생: ${err.message}`);
      }
    })();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>데이터 필터링</h1>
      <ul>
        {progress.map((msg, idx) => (
          <li key={idx}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default CombinedFilters;
