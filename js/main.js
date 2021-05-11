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
      // 적용하려는 CSS 값, 정보들의 모음
      values: {
        // a section
        aMessageOpacityIn: [0, 1, { start: 0.1, end: 0.2 }],
        aMessageOpacityOut: [1, 0, { start: 0.25, end: 0.3 }],
        aMessageTranslateYIn: [20, 0, { start: 0.1, end: 0.2 }],
        aMessageTranslateYOut: [0, -20, { start: 0.25, end: 0.3 }],

        // b section
        bMessageOpacityIn: [0, 1, { start: 0.3, end: 0.4 }],
        bMessageOpacityOut: [1, 0, { start: 0.45, end: 0.5 }],
        bMessageTranslateYIn: [20, 0, { start: 0.3, end: 0.4 }],
        bMessageTranslateYOut: [0, -20, { start: 0.45, end: 0.5 }],

        // c section
        cMessageOpacityIn: [0, 1, { start: 0.5, end: 0.6 }],
        cMessageOpacityOut: [1, 0, { start: 0.65, end: 0.7 }],
        cMessageTranslateYIn: [20, 0, { start: 0.5, end: 0.6 }],
        cMessageTranslateYOut: [0, -20, { start: 0.65, end: 0.7 }],

        // d section
        dMessageOpacityIn: [0, 1, { start: 0.7, end: 0.8 }],
        dMessageOpacityOut: [1, 0, { start: 0.85, end: 0.9 }],
        dMessageTranslateYIn: [20, 0, { start: 0.7, end: 0.8 }],
        dMessageTranslateYOut: [0, -20, { start: 0.85, end: 0.9 }],
      },
    },
    {
      // 1
      type: "normal",
      // heightNum: 5,
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
        aMessage: document.querySelector("#scroll-section-2 .main-message.a"),
        bMessage: document.querySelector("#scroll-section-2 .desc-message.b"),
        cMessage: document.querySelector("#scroll-section-2 .desc-message.c"),
        bPin: document.querySelector("#scroll-section-2 .desc-message.b .pin"),
        cPin: document.querySelector("#scroll-section-2 .desc-message.c .pin"),
      },
      values: {
        // a section
        aMessageOpacityIn: [0, 1, { start: 0.15, end: 0.2 }],
        aMessageOpacityOut: [1, 0, { start: 0.3, end: 0.35 }],
        aMessageTranslateYIn: [20, 0, { start: 0.15, end: 0.2 }],
        aMessageTranslateYOut: [0, -20, { start: 0.3, end: 0.35 }],

        // b section
        bMessageOpacityIn: [0, 1, { start: 0.5, end: 0.55 }],
        bMessageOpacityOut: [1, 0, { start: 0.58, end: 0.63 }],
        bMessageTranslateYIn: [30, 0, { start: 0.5, end: 0.55 }],
        bMessageTranslateYOut: [0, -20, { start: 0.58, end: 0.63 }],
        bPinScaleY: [0.5, 1, { start: 0.5, end: 0.55 }],

        // c section
        cMessageOpacityIn: [0, 1, { start: 0.72, end: 0.77 }],
        cMessageOpacityOut: [1, 0, { start: 0.85, end: 0.9 }],
        cMessageTranslateYIn: [30, 0, { start: 0.72, end: 0.77 }],
        cMessageTranslateYOut: [0, -20, { start: 0.85, end: 0.9 }],
        cPinScaleY: [0.5, 1, { start: 0.72, end: 0.77 }],
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
      if (sceneInfo.type === "sticky") {
        sceneInfo.scrollHeight = sceneInfo.heightNum * window.innerHeight;
      } else {
        // 'normal'
        sceneInfo.scrollHeight = sceneInfo.objs.container.offsetHeight;
      }
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

    const scrollHeight = sceneInfos[currentSceneIdx].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    const lastValue = values[1];
    const initalValue = values[0];
    const valueUnit = lastValue - initalValue;

    const hasSection = values.length === 3;
    if (hasSection) {
      /**
       * 애니메이션에 구간이 있는 경우,
       * 섹션의 Height을 기준으로 비율을 구해야한다.
       */
      const sectionInfo = values[2];
      const sectionStart = sectionInfo.start * scrollHeight;
      const sectionEnd = sectionInfo.end * scrollHeight;
      const sectionHeight = sectionEnd - sectionStart;

      let sectionRatio = 0;
      let currentSectionYOffset = currentYOffset - sectionStart;

      if (currentSectionYOffset < 0) {
        sectionRatio = 0;
      } else if (currentSectionYOffset >= sectionHeight) {
        sectionRatio = 1;
      } else {
        sectionRatio = currentSectionYOffset / sectionHeight;
      }

      result = sectionRatio * valueUnit + initalValue;
    } else {
      result = scrollRatio * valueUnit + initalValue;
    }

    return result;
  }

  function playAnimation() {
    const { objs, values, scrollHeight } = sceneInfos[currentSceneIdx];
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollRatio = currentYOffset / scrollHeight; // 현재 scroll Y / 현재 씬의 scrollHeight

    switch (currentSceneIdx) {
      case 0:
        if (scrollRatio <= 0.22) {
          objs.aMessage.style.opacity = calcValues(
            values.aMessageOpacityIn,
            currentYOffset
          );
          objs.aMessage.style.transform = `translateY(${calcValues(
            values.aMessageTranslateYIn,
            currentYOffset
          )}%)`;
        } else {
          objs.aMessage.style.opacity = calcValues(
            values.aMessageOpacityOut,
            currentYOffset
          );
          objs.aMessage.style.transform = `translateY(${calcValues(
            values.aMessageTranslateYOut,
            currentYOffset
          )}%)`;
        }

        if (scrollRatio <= 0.42) {
          objs.bMessage.style.opacity = calcValues(
            values.bMessageOpacityIn,
            currentYOffset
          );
          objs.bMessage.style.transform = `translateY(${calcValues(
            values.bMessageTranslateYIn,
            currentYOffset
          )}%)`;
        } else {
          objs.bMessage.style.opacity = calcValues(
            values.bMessageOpacityOut,
            currentYOffset
          );
          objs.bMessage.style.transform = `translateY(${calcValues(
            values.bMessageTranslateYOut,
            currentYOffset
          )}%)`;
        }

        if (scrollRatio <= 0.62) {
          objs.cMessage.style.opacity = calcValues(
            values.cMessageOpacityIn,
            currentYOffset
          );
          objs.cMessage.style.transform = `translateY(${calcValues(
            values.cMessageTranslateYIn,
            currentYOffset
          )}%)`;
        } else {
          objs.cMessage.style.opacity = calcValues(
            values.cMessageOpacityOut,
            currentYOffset
          );
          objs.cMessage.style.transform = `translateY(${calcValues(
            values.cMessageTranslateYOut,
            currentYOffset
          )}%)`;
        }

        if (scrollRatio <= 0.82) {
          objs.dMessage.style.opacity = calcValues(
            values.dMessageOpacityIn,
            currentYOffset
          );
          objs.dMessage.style.transform = `translateY(${calcValues(
            values.dMessageTranslateYIn,
            currentYOffset
          )}%)`;
        } else {
          objs.dMessage.style.opacity = calcValues(
            values.dMessageOpacityOut,
            currentYOffset
          );
          objs.dMessage.style.transform = `translateY(${calcValues(
            values.dMessageTranslateYOut,
            currentYOffset
          )}%)`;
        }
        break;
      // normal 이므로 제외
      // case 1:
      //   break;
      case 2:
        if (scrollRatio <= 0.32) {
          objs.aMessage.style.opacity = calcValues(
            values.aMessageOpacityIn,
            currentYOffset
          );
          objs.aMessage.style.transform = `translateY(${calcValues(
            values.aMessageTranslateYIn,
            currentYOffset
          )}%)`;
        } else {
          objs.aMessage.style.opacity = calcValues(
            values.aMessageOpacityOut,
            currentYOffset
          );
          objs.aMessage.style.transform = `translateY(${calcValues(
            values.aMessageTranslateYOut,
            currentYOffset
          )}%)`;
        }

        if (scrollRatio <= 0.67) {
          objs.bMessage.style.opacity = calcValues(
            values.bMessageOpacityIn,
            currentYOffset
          );
          objs.bMessage.style.transform = `translateY(${calcValues(
            values.bMessageTranslateYIn,
            currentYOffset
          )}%)`;
          objs.bPin.style.transform = `scaleY(${calcValues(
            values.bPinScaleY,
            currentYOffset
          )})`;
        } else {
          objs.bMessage.style.opacity = calcValues(
            values.bMessageOpacityOut,
            currentYOffset
          );
          objs.bMessage.style.transform = `translateY(${calcValues(
            values.bMessageTranslateYOut,
            currentYOffset
          )}%)`;
          objs.bPin.style.transform = `scaleY(${calcValues(
            values.bPinScaleY,
            currentYOffset
          )})`;
        }

        if (scrollRatio <= 0.93) {
          objs.cMessage.style.opacity = calcValues(
            values.cMessageOpacityIn,
            currentYOffset
          );
          objs.cMessage.style.transform = `translateY(${calcValues(
            values.cMessageTranslateYIn,
            currentYOffset
          )}%)`;
          objs.cPin.style.transform = `scaleY(${calcValues(
            values.cPinScaleY,
            currentYOffset
          )})`;
        } else {
          objs.cMessage.style.opacity = calcValues(
            values.cMessageOpacityOut,
            currentYOffset
          );
          objs.cMessage.style.transform = `translateY(${calcValues(
            values.cMessageTranslateYOut,
            currentYOffset
          )}%)`;
          objs.cPin.style.transform = `scaleY(${calcValues(
            values.cPinScaleY,
            currentYOffset
          )})`;
        }
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
