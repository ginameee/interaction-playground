인프런 강의 실습이다.

스크롤에따른 인터렉션을 구현해본다.

# 1. 마크업, 스타일링

## 스크롤되는 구간을 정하자

문자가 기준이 아닌, 백그라운드의 이미지나 비디오가 변경되는 큰 단위를 기준으로 기준으로 나누자.

1. 컵이 회전하는 스크롤 영역
2. 일반 스크롤 영역
3. 컵이 아래에서 위로 올라와서 돌아간 후 설명이 되는 스크롤 영역
4. 1분이 케릭터가 나오고 꽉 찬 후 이미지로 변경되는 영역

## 스크롤되는 구간을 section으로 나누자

스크롤 구간을 나누는 이유는 구조상으로도 자연스럽지만, 스크립트의 개발을 위해서도 나누는게 좋다.

```html
<section class="scroll-section" id="scroll-section-0"></section>
<section class="scroll-section" id="scroll-section-1"></section>
<section class="scroll-section" id="scroll-section-2"></section>
<section class="scroll-section" id="scroll-section-3"></section>
```

# 2. 인터렉션 구현 컨셉 정하기

1. 장면장면을 나눈다. (구간을 나눈다.)
2. 구간에 해당하는 애니메이션을 처리한다.

![timeline](lecture-resource/timeline.png)

## 타임라인을 생각하자.

애니메이션이 재생되는 구간을 "타임라인"이라고 부른다.\
애니메이션(비디오)가 재생의 자동재생이아닌 스크롤값에 의해 재생이된다.

스크롤 구간별로 애니메이션을 세팅시킨다.

## 스크롤 영역별 스크롤값을 정해주자

영역별로 높이값을 지정하고, 영역별 높이값과 윈도우의 현재 스크롤값의 비교를 통해 현재 화면에 보여지는 구할 수 있다.
![cal-scroll](lecture-resource/cal-scroll.png)

## 눈에 보여지는 영역의 애니메이션만 재생되도록 해야한다.

스크롤이 위치한 구간에 있는 요소들만 재생하도록 한다. (퍼포먼스를 위함)

## 애니메이션재생에 필요한 정보들은 스크립트에 저장한다.

스크립트내에서 미리 정해놓는다. (배열형태로 저장)

### 공통

- 재생 구간별 스크롤 값

### 비디오

- 재생시간
- 재생프레임 수

### 이미지

- 프레임 정보

### 텍스트 애니메이션

- 애니메이션 타이밍

# 3. 인터렉션 구현하기

## 애니메이션을 위한 정보를 담을 객체 정의

```js
const sceneInfos = [
  {
    // 0
    type: "sticky",
    heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅 (배율)
    scrollHeight: 0, // 애니메이션이 끝나는 구간 (초기에 static한 값으로 세팅할 수 없다. 반응형이기때문)
    objs: {
      container: document.querySelector("#scroll-section-0"),
      ...
    },
  },
  {
    // 1
    type: "normal",
    heightNum: 5,
    scrollHeight: 0,
    objs: {
      container: document.querySelector("#scroll-section-1"),
      ...
    },
  },
  {
    // 2
    type: "sticky",
    heightNum: 5,
    scrollHeight: 0,
    objs: {
      container: document.querySelector("#scroll-section-2"),
      ...
    },
  },
  {
    // 3
    type: "sticky",
    heightNum: 5,
    scrollHeight: 0,
    objs: {
      container: document.querySelector("#scroll-section-3"),
      ...
    },
  },
];
```

## 스크롤 높이 세팅

```js
/**
 * 각 스크롤 섹션의 높이 세팅
 */
function setLayout() {
  for (const sceneInfo of sceneInfos) {
    sceneInfo.scrollHeight = sceneInfo.heightNum * window.innerHeight;
    sceneInfo.objs.container.style.height = `${sceneInfo.scrollHeight}px`;
  }
}

window.addEventListener("resize", setLayout);
```
