(() => {
  /**
   * 즉시시랭함수 내부에서 사용하는 이유: 전역변수의 선언/사용을 방지하기위해
   */

  let yOffset = 0; // window.pageYOffset 대신 쓸 변수
  const sceneInfos = [
    {
      // 0
      type: "sticky",
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0, // 애니메이션이 끝나는 구간 (초기에 static한 값으로 세팅할 수 없다. 반응형이기때문)
      objs: {
        container: document.querySelector("#scroll-section-0"),
      },
    },
    {
      // 1
      type: "normal",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-1"),
      },
    },
    {
      // 2
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-2"),
      },
    },
    {
      // 3
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-3"),
      },
    },
  ];

  /**
   * 각 스크롤 섹션의 높이 세팅
   */
  function setLayout() {
    for (const sceneInfo of sceneInfos) {
      sceneInfo.scrollHeight = sceneInfo.heightNum * window.innerHeight;
      sceneInfo.objs.container.style.height = `${sceneInfo.scrollHeight}px`;
    }
  }

  function scrollLoop() {}

  window.addEventListener("resize", setLayout);
  window.addEventListener("scroll", () => {
    yOffset = window.pageYOffset;
    scrollLoop();
  });

  setLayout();
})();
