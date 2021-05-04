(() => {
  /**
   * 즉시시랭함수 내부에서 사용하는 이유: 전역변수의 선언/사용을 방지하기위해
   */

  let yOffset = 0; // window.pageYOffset 대신 쓸 변수
  let prevScrollHeight = 0; // 현재 활성화 섹션 이전 섹션의 height
  let currentSceneIdx = 0; // 현재 활성화된 scene idx(=scroll-section)
  let enterNewScene = false; // 새로운 scnen이 시작된 순간 true
  const sceneInfos = [
    {
      // 0
      type: "sticky",
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0, // 애니메이션이 끝나는 구간 (초기에 static한 값으로 세팅할 수 없다. 반응형이기때문)
      objs: {
        container: document.querySelector("#scroll-section-0"),
        aMessage: document.querySelector("#scroll-section-0 .main-message.a"),
        bMessage: document.querySelector("#scroll-section-0 .main-message.b"),
        cMessage: document.querySelector("#scroll-section-0 .main-message.c"),
        dMessage: document.querySelector("#scroll-section-0 .main-message.d"),
      },
      // 적용하려는 CSS 값들의 모음
      values: {
        aMessageOpacity: [0, 1], // [시작 값, 끝 값], 스크롤값에 따라 이 구간사이에 대응하는 값을 적용해주어야한다.
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

    /**
     * 첫 페이지 로드시 currentSceneIdx 결정
     * 스크롤이 유지되는 새로고침의 경우, 위치한 스크롤에 맞는 currentSceneIdx로 설정해주어야 한다.
     */
    yOffset = window.pageYOffset;
    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfos.length; i++) {
      const sceneInfo = sceneInfos[i];
      totalScrollHeight += sceneInfo.scrollHeight;

      if (totalScrollHeight >= yOffset) {
        currentSceneIdx = i;
        break;
      }
    }

    document.body.setAttribute("id", `show-scene-${currentSceneIdx}`);
  }

  function scrollLoop() {
    enterNewScene = false;
    prevScrollHeight = 0;

    for (let i = 0; i < currentSceneIdx; i++) {
      prevScrollHeight += sceneInfos[i].scrollHeight;
    }

    if (yOffset > prevScrollHeight + sceneInfos[currentSceneIdx].scrollHeight) {
      enterNewScene = true;
      currentSceneIdx++;
      document.body.setAttribute("id", `show-scene-${currentSceneIdx}`);
    }

    if (yOffset < prevScrollHeight) {
      if (currentSceneIdx === 0) {
        return;
      }
      enterNewScene = true;
      currentSceneIdx--;
      document.body.setAttribute("id", `show-scene-${currentSceneIdx}`);
    }

    // 씬이 바뀌는 순간에 값이 튀기는 현상이 있다. 이를 방지하기위함
    if (enterNewScene) {
      return;
    }
    playAnimation();
  }

  /**
   * 스크롤영역에서 현재 스크롤의 배율에 해당하는 value 값을 구한다.
   * @param {Array} values - 시작값, 끝값
   */
  function calcValues(values, currentYOffset) {
    let result;
    const sceneInfo = sceneInfos[currentSceneIdx];
    let scrollRatio = currentYOffset / sceneInfo.scrollHeight;
    const lastValue = values[values.length - 1];
    const initalValue = values[0];
    const valueUnit = lastValue - initalValue;

    result = scrollRatio * valueUnit + initalValue;

    return result;
  }

  function playAnimation() {
    const { objs, values } = sceneInfos[currentSceneIdx];
    const currentYOffset = yOffset - prevScrollHeight;

    switch (currentSceneIdx) {
      case 0:
        let aMessageOpacity = calcValues(
          values.aMessageOpacity,
          currentYOffset
        );
        objs.aMessage.style.opacity = aMessageOpacity;
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
    }
  }

  window.addEventListener("load", setLayout);
  window.addEventListener("resize", setLayout);
  window.addEventListener("scroll", () => {
    yOffset = window.pageYOffset;
    scrollLoop();
  });
})();
