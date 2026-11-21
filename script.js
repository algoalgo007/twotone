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
    id: 1, title: "완수포차", badge: "20평형 리모델링", summary: "힙한 느낌의 감성 공간",
    thumbnail: "./img/img1.jpeg",
    location: "안산 중앙구", size: "20평", duration: "4주", structure: "철거 후 주방, 홀, 테라스 공간, 전체 리모델링",
    galleryImages: ["./img/wansu1.jpeg", "./img/wansu2.jpeg"],
  },
  {
    id: 2, title: "", badge: "Tüv Süd", summary: "140평 공장건물 내/외부 전체 철거 및 원상복구",
    thumbnail: "./img/tuvThumb.jpeg",
    location: "경기도 수원시 권선구 입북로 25-2", size: "140평", duration: "3주", structure: "140평 공장건물 내/외부 전체 철거 및 원상복구",
    galleryImages: ["./img/tuv4.jpeg", "./img/tuv5.jpeg", "./img/tuv6.jpeg", "./img/tuv7.jpeg", "./img/tuv8.jpeg", "./img/tuv9.jpeg", "./img/tuv10.jpeg", "./img/tuv11.jpeg", "./img/tuv12.jpeg", "./img/tuv13.jpeg", "./img/tuv14.jpeg", "./img/tuv15.jpeg", "./img/tuv16.jpeg", "./img/tuv17.jpeg", "./img/tuv18.jpeg"],
  },
];

// 각 포트폴리오 데이터가 독립된 갤러리 이미지 배열을 소유합니다.
const portfolioDetailModals = new Map();
const detailModalTemplate = document.getElementById("portfolioDetailView");

portfolioData.forEach((item, index) => {
  const modal = detailModalTemplate.cloneNode(true);
  modal.id = `portfolioDetailView-${item.id}`;
  modal.querySelectorAll("[data-detail]").forEach((field) => {
    field.removeAttribute("id");
  });
  modal.querySelector(".detail-gallery").dataset.modalGallery = String(item.id);
  modal.querySelector("[onclick^='closePortfolioDetail']").removeAttribute("onclick");
  // 템플릿 버튼에는 식별자를 추가해 복제본마다 닫기 동작을 연결합니다.
  const closeButton = modal.querySelector(".sticky button");
  closeButton.addEventListener("click", () => closePortfolioDetail(item.id));
  document.body.appendChild(modal);
  portfolioDetailModals.set(item.id, modal);
});
detailModalTemplate.remove();

function renderModalGallery(modal, images) {
  const galleryContainer = modal.querySelector(".detail-gallery");
  if (!galleryContainer) return;

  galleryContainer.replaceChildren();
  const fragment = document.createDocumentFragment();
  images.forEach((imgSrc) => {
    const img = document.createElement("img");
    img.src = imgSrc;
    img.loading = "lazy";
    img.className = "w-full h-auto object-cover rounded-xl md:rounded-2xl shadow-xl border border-white/5";
    fragment.appendChild(img);
  });
  galleryContainer.appendChild(fragment);
}

// 포트폴리오 리스트 렌더링
const gridContainer = document.getElementById("portfolio-grid");
portfolioData.forEach((item, index) => {
  const cardHTML = `
    <div data-portfolio-index="${index}" class="bg-neutral-900 rounded-xl overflow-hidden border border-white/5 hover:border-brand-accent/40 transition duration-300 group cursor-pointer shadow-lg hover:shadow-brand-accent/10 flex flex-col h-full">
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
gridContainer.querySelectorAll("[data-portfolio-index]").forEach((card) => {
  card.addEventListener("click", () => openPortfolioDetail(Number(card.dataset.portfolioIndex)));
});

// 상세 모달 열기
function openPortfolioDetail(index) {
  const data = portfolioData[index];
  const modal = portfolioDetailModals.get(data.id);
  if (!modal) return;

  modal.querySelector('[data-detail="title"]').innerText = data.title;
  modal.querySelector('[data-detail="location"]').innerText = data.location;
  modal.querySelector('[data-detail="size-time"]').innerText = `${data.size} / ${data.duration}`;
  modal.querySelector('[data-detail="structure"]').innerText = data.structure;
  renderModalGallery(modal, data.galleryImages);

  modal.classList.remove("hidden");
  modal.scrollTop = 0;
  setTimeout(() => { modal.classList.remove("opacity-0"); modal.classList.add("opacity-100"); }, 10);
  document.body.style.overflow = "hidden";
}

// 상세 모달 닫기
function closePortfolioDetail(portfolioId) {
  const modal = portfolioDetailModals.get(portfolioId);
  if (!modal) return;
  modal.classList.remove("opacity-100");
  modal.classList.add("opacity-0");

  setTimeout(() => {
    modal.classList.add("hidden");
    const anotherDetailOpen = [...portfolioDetailModals.values()].some((candidate) => !candidate.classList.contains("hidden"));
    if (!anotherDetailOpen) document.body.style.overflow = "auto";
  }, 300);
}

// HTML 뼈대가 모두 그려진 다음에 스크립트가 작동하도록 감싸줍니다.
document.addEventListener('DOMContentLoaded', function() {
  
  const contactForm = document.getElementById('contactForm');
  
  // 현재 페이지에 폼이 있을 때만 아래 코드 실행 (다른 페이지에서 에러 방지)
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault(); 
      
      const form = e.target;
      const submitBtn = document.getElementById('submitBtn');
      const formData = new FormData(form);
      
      // ★ 1단계에서 발급받은 구글 스크립트 URL 입력
      const scriptURL = 'https://script.google.com/macros/s/AKfycbzK1Rz7sLs9yXsqUE9bgXTocvcsq2eRQpKp1jzMhOW9IUdE3cv69x5ClxbXEeItZuop/exec';

      // 전송 중복 방지
      submitBtn.disabled = true;
      submitBtn.innerText = '전송 중...';

      fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => {
          alert('상담 신청이 완료되었습니다! 빠른 시일 내 연락드리겠습니다.');
          form.reset(); 
          
          // closeModal 함수가 정상적으로 존재하는지 확인 후 실행 (안전장치)
          if (typeof closeModal === 'function') {
            closeModal();
          } else {
            console.warn('closeModal 함수를 찾을 수 없습니다.');
          }
        })
        .catch(error => {
          alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
          console.error('Error!', error.message);
        })
        .finally(() => {
          // 버튼 상태 복구
          submitBtn.disabled = false;
          submitBtn.innerText = '무료 상담 신청하기';
        });
    });
  }
});