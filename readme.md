인프런 강의 실습이다.

스크롤에따른 인터렉션을 구현할 수 있다.

# 스크롤되는 구간을 정하자

문자가 기준이 아닌, 백그라운드의 이미지나 비디오가 변경되는 지점을 기준으로 나누자.

1. 컵이 회전하는 스크롤 영역
2. 일반 스크롤 영역
3. 컵이 아래에서 위로 올라와서 돌아간 후 설명이 되는 스크롤 영역
4. 1분이 케릭터가 나오고 꽉 찬 후 이미지로 변경되는 영역

# 스크롤되는 구간을 section으로 나누자

스크롤 구간을 나누는 이유는 구조상으로도 자연스럽지만, 스크립트의 개발을 위해서도 나누는게 좋다.

```html
<section class="scroll-section" id="scroll-section-0"></section>
<section class="scroll-section" id="scroll-section-1"></section>
<section class="scroll-section" id="scroll-section-2"></section>
<section class="scroll-section" id="scroll-section-3"></section>
```
