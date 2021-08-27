import { useStore as _useStore } from 'vuex';

// onMounted: DOM이 붙은 경우(이때 부터 DOM 셀렉트를 할 수 있다)
// onBeforeUpdate: Reactive 데이터가 바뀐 경우
// onUpdated: DOM이 변한 경우(re-rendering 된 경우) -> $nextTick 활용법 확인 후 사용
// onBeforeUnmount: 컴포넌트 해제되기 전
// onUnmounted: 컴포넌트 해제된 후

// vue + vuex
export {
  reactive,
  ref,
  toRefs,
  computed,
  watch,
  watchEffect,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  defineAsyncComponent,
} from 'vue';

// vuex
export const useStore = () => {
  const store = _useStore();
  return {
    state: store.state,
    get: store.getters,
    commit: store.commit,
    dispatch: store.dispatch,
  };
};
