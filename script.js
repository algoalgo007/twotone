// 3D 커버플로우 회전 슬라이더 초기화
const swiper = new Swiper('.mySwiper', {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  
  // ★ 루프 안 함
  loop: false, 

  // ★ [핵심 1] 끝단(5번)에서 다시 되돌아올 때 덜컥거리는 저항 현상 제거
  resistanceRatio: 0.85,

  // ★ [핵심 2] 드래그하는 동안 3D 변형 좌표를 매 프레임마다 실시간으로 정확히 추적
  watchSlidesProgress: true,

  coverflowEffect: {
    rotate: 15,          // ★ [핵심 3] 각도를 15~20 정도로 낮춰야 되돌아갈 때 3D 축이 안 꼬입니다.
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: false, // ★ [핵심 4] 역방향 드래그를 막는 3D 그림자 레이어 끄기
  },

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});

// Before & After 비교 슬라이더 제어
function moveSlider(val) {
  document.getElementById('comp-overlay').style.width = val + '%';
  document.getElementById('before-img').style.width = (100 / (val / 100)) + '%';
}

// 상담 모달 제어
function openModal() { document.getElementById('estimateModal').classList.remove('hidden'); }
function closeModal() { document.getElementById('estimateModal').classList.add('hidden'); }

// 포트폴리오 12개 데이터
const portfolioData = [
  {
    id: 1, title: "신대방 현대아파트 32평", badge: "32평형 리모델링", summary: "구정마루 그랜드 텍스처와 디아망 회벽으로 완성한 하이엔드 공간",
    thumbnail: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
    location: "서울시 동작구 여의대방로 28", size: "32평", duration: "6주", structure: "거실 확장, 안방 드레스룸 가벽",
    functions: "창호 O / 시스템에어컨 O / 단열 공사 X / 방수 공사 X",
    materials: "바닥 : 구정마루 그랜드 텍스처 165 본오크<br>벽체(공용부) : 디아망 회벽 크림 화이트 PR002-12<br>벽체(방) : 베스띠 프레스코 회벽 웜 미스트 그레이 82576-03",
    furniture: "한솔 조슈아라이트, 한솔 포그그레이", kitchen: "ROME PHANTOM IVORY 세라믹"
  },
  {
    id: 2, title: "반포 자이 아파트 54평", badge: "54평형 펜트하우스", summary: "대면형 세라믹 아일랜드와 라인조명이 돋보이는 모던 럭셔리",
    thumbnail: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
    location: "서울시 서초구 신반포로 270", size: "54평", duration: "8주", structure: "주방 레이아웃 전면 수정, 욕실 조적 파티션",
    functions: "창호 O / 시스템에어컨 O / 단열 공사 O / 방수 공사 O",
    materials: "바닥 : 천연 대리석 비앙코 카라라<br>벽체(공용부) : 벤자민무어 친환경 도장<br>벽체(방) : 실크벽지 화이트",
    furniture: "제작 가구 (무광 화이트 & 월넛 우드)", kitchen: "이태리 수입 천연 칸스톤"
  },
  {
    id: 3, title: "성수 트리마제 38평", badge: "38평형 리모델링", summary: "한강 뷰를 극대화한 미니멀 화이트 인테리어",
    thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    location: "서울시 성동구 왕십리로 16", size: "38평", duration: "5주", structure: "거실 폴딩도어 철거 및 확장, 히든도어 시공",
    functions: "창호 X / 시스템에어컨 O / 단열 공사 O / 방수 공사 X",
    materials: "바닥 : 동화 자연마루 나투스진<br>벽체 : 전체 디아망 모던 화이트",
    furniture: "PET 무광 화이트", kitchen: "LX 하우시스 오로라 블랑"
  },
  {
    id: 4, title: "잠실 엘스 아파트 45평", badge: "45평형 리모델링", summary: "따뜻한 웜톤 우드와 간접조명의 조화", thumbnail: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    location: "서울시 송파구 올림픽로 99", size: "45평", duration: "6주", structure: "알파룸 가벽 철거 후 다이닝룸 조성", functions: "창호 O / 에어컨 O", materials: "바닥: 광폭 강마루<br>벽체: 친환경 실크벽지", furniture: "한솔 도어 페트", kitchen: "세라믹 상판 동일 마감"
  },
  {
    id: 5, title: "마포 래미안 푸르지오 34평", badge: "34평형 리모델링", summary: "신혼부부를 위한 감성적인 홈카페 스타일링", thumbnail: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80",
    location: "서울시 마포구 마포대로 195", size: "34평", duration: "4주", structure: "주방 아일랜드 신설", functions: "창호 X / 에어컨 O", materials: "바닥: 포세린 타일 600각<br>벽체: 실크벽지", furniture: "E0 등급 맞춤가구", kitchen: "인조대리석 크리스탈"
  },
  {
    id: 6, title: "한남 더힐 65평", badge: "65평형 하이엔드", summary: "갤러리를 연상케 하는 웅장한 도장 마감 프로젝트", thumbnail: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    location: "서울시 용산구 한남대로 91", size: "65평", duration: "10주", structure: "마스터룸 욕실 확장, 전실 게이트 신설", functions: "전체 올수리", materials: "바닥: 원목마루<br>벽체: 스페셜 도장", furniture: "이태리 직수입 가구", kitchen: "불탑(Bulthaup) 주방가구"
  },
  {
    id: 7, title: "목동 신시가지 7단지 27평", badge: "27평형 리모델링", summary: "공간 활용도를 극대화한 소형 평수 레이아웃의 정석", thumbnail: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
    location: "서울시 양천구 목동서로", size: "27평", duration: "4주", structure: "거실 확장, 주방 구조 변경", functions: "창호 O / 단열 O", materials: "바닥: 강마루<br>벽체: 실크벽지", furniture: "무광 화이트", kitchen: "LX 하우시스"
  },
  {
    id: 8, title: "판교 푸르지오 그랑블 39평", badge: "39평형 리모델링", summary: "호텔식 건식 욕실과 대면형 주방의 완벽한 조화", thumbnail: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
    location: "경기도 성남시 분당구 동판교로", size: "39평", duration: "5주", structure: "욕실 조적 욕조, 주방 벽체 철거", functions: "전체 시공", materials: "바닥: 600각 타일<br>벽체: 벤자민무어", furniture: "한솔 포그그레이", kitchen: "칸스톤 루나화이트"
  },
  {
    id: 9, title: "광교 중흥S클래스 44평", badge: "44평형 리모델링", summary: "루버 디자인과 간접등으로 포인트를 준 아트월", thumbnail: "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?auto=format&fit=crop&w=800&q=80",
    location: "경기도 수원시 영통구 광교호수공원로", size: "44평", duration: "6주", structure: "아트월 조성, 안방 구조변경", functions: "창호 X / 에어컨 O", materials: "바닥: 대리석 타일<br>벽체: 도장 및 벽지", furniture: "제작 가구", kitchen: "세라믹 상판"
  },
  {
    id: 10, title: "여의도 자이 56평", badge: "56평형 리모델링", summary: "클래식과 모던이 공존하는 웨인스코팅 인테리어", thumbnail: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    location: "서울시 영등포구 여의동로", size: "56평", duration: "7주", structure: "전체 웨인스코팅, 폴딩도어", functions: "창호 O / 에어컨 O", materials: "바닥: 헤링본 원목마루<br>벽체: 벤자민무어 도장", furniture: "프렌치 스타일 맞춤가구", kitchen: "천연 대리석"
  },
  {
    id: 11, title: "압구정 현대아파트 42평", badge: "42평형 구축 리모델링", summary: "오래된 구축의 환골탈태, 배관부터 다시 잡은 기초공사", thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    location: "서울시 강남구 압구정로", size: "42평", duration: "8주", structure: "전체 설비 재시공, 분배기 이전", functions: "창호, 단열, 방수, 에어컨 전부", materials: "바닥: 동화마루 나투스진<br>벽체: 실크", furniture: "E0 등급 무광가구", kitchen: "인조대리석"
  },
  {
    id: 12, title: "송도 더샵 퍼스트월드 60평", badge: "60평형 펜트하우스", summary: "높은 층고를 살린 웅장한 복층형 디자인", thumbnail: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=800&q=80",
    location: "인천시 연수구 해돋이로", size: "60평", duration: "9주", structure: "계단실 재조성, 보이드 공간 조명", functions: "전체 리모델링", materials: "바닥: 포세린 타일<br>벽체: 스페셜 도장", furniture: "수입 가구 배치", kitchen: "하이엔드 세라믹"
  }
];

// 고화질 인테리어 이미지 풀 (15장을 만들기 위해 반복 사용)
const galleryImagePool = [
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80"
];

// 포트폴리오 리스트 렌더링
const gridContainer = document.getElementById("portfolio-grid");
portfolioData.forEach((item, index) => {
  const cardHTML = `
    <div onclick="openPortfolioDetail(${index})" class="bg-neutral-900 rounded-xl overflow-hidden border border-white/5 hover:border-brand-accent/40 transition duration-300 group cursor-pointer shadow-lg hover:shadow-brand-accent/10 flex flex-col h-full">
      <div class="relative h-64 overflow-hidden shrink-0">
        <img src="${item.thumbnail}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
        <span class="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-brand-accent text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider">${item.badge}</span>
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
          <span class="bg-brand-accent text-black font-bold px-5 py-2.5 rounded-full text-sm shadow-lg">크게 보기 +</span>
        </div>
      </div>
      <div class="p-6 flex flex-col grow">
        <h4 class="font-bold text-lg text-white group-hover:text-brand-accent transition">${item.title}</h4>
        <p class="text-slate-400 text-xs mt-2 line-clamp-2 grow">${item.summary}</p>
        <div class="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-slate-500">
          <span>시공기간: ${item.duration}</span>
          <span class="text-brand-accent font-semibold">자세히 보기 &rarr;</span>
        </div>
      </div>
    </div>
  `;
  gridContainer.innerHTML += cardHTML;
});

// 상세 모달 열기
function openPortfolioDetail(index) {
  const data = portfolioData[index];
  
  // 텍스트 바인딩
  document.getElementById("detail-title").innerText = data.title;
  document.getElementById("detail-location").innerText = data.location;
  document.getElementById("detail-size-time").innerText = `${data.size} / ${data.duration}`;
  document.getElementById("detail-structure").innerText = data.structure;
  document.getElementById("detail-functions").innerText = data.functions;
  document.getElementById("detail-materials").innerHTML = data.materials;
  document.getElementById("detail-furniture").innerText = data.furniture;
  document.getElementById("detail-kitchen").innerText = data.kitchen;

  // 15개 갤러리 이미지 주루룩(세로) 배치 (w-full 로 꽉 차게)
  const galleryContainer = document.getElementById("detail-gallery");
  galleryContainer.innerHTML = ""; 
  
  for(let i=0; i<15; i++) {
    const imgSrc = galleryImagePool[i % galleryImagePool.length]; 
    galleryContainer.innerHTML += `
      <img src="${imgSrc}" loading="lazy" class="w-full h-auto object-cover rounded-xl md:rounded-2xl shadow-xl border border-white/5">
    `;
  }

  // 모달 열기 처리
  const modal = document.getElementById("portfolioDetailView");
  modal.classList.remove("hidden");
  // 최상단으로 스크롤 이동
  modal.scrollTop = 0;
  
  setTimeout(() => { modal.classList.remove("opacity-0"); modal.classList.add("opacity-100"); }, 10);
  document.body.style.overflow = "hidden"; // 바탕 페이지 스크롤 방지
}

// 상세 모달 닫기
function closePortfolioDetail() {
  const modal = document.getElementById("portfolioDetailView");
  modal.classList.remove("opacity-100");
  modal.classList.add("opacity-0");
  
  setTimeout(() => {
    modal.classList.add("hidden");
    document.body.style.overflow = "auto"; // 바탕 스크롤 복구
  }, 300);
}