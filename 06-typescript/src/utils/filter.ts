// export function filterBy<>(items: T[], predicate: (item: T) => boolean): T[] {
//   return items.filter(predicate);
// }

// 파라미터 : 다양한 종류의 배열, 함수(해당 종류의 배열 안에 있는 아이템 타입)>boolean
// 반환 값 : 해당 종류의 배열
function filterBy<T>(items : T[], predicate: (item: T) => boolean): T[] {
  return items.filter(predicate)
}

export { filterBy }