export function checkObjectExistenceById(arr, id){
    return arr.some(obj => obj.friends_id && obj.friends_id.toString() === id.toString());
  };
export function findObjectsByMethod(arr, _id){
    return arr.find(e => e.friends_id === _id);
    };
export function methods(arr, methodname){
    arr.map(obj => obj[methodname]);
} 
export function extractIds(documents) {
    const ids = documents.map((doc) => doc.friends_id);
    return ids;
  }
  