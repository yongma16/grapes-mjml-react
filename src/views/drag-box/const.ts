//
// import Task from './componets/Task'
export const getData=()=>{
  let res=[]
  for(let i=0;i<10;++i){
    res.push({
      id:i
    })
  }
  return res
}
// fake data generator
export const getItems = (count:number) =>{
  let res=[]
  for(let i=0;i<count;++i){
    res.push({
      id: `item-${i}`,
      content: `item ${i}`
    })
  }
  return res
}
// Array.from({ length: count }, (v, k) => k).map(k => ({
//     id: `item-${k}`,
//     content: `item ${k}`
// }));

// fake data generator
export const getRightItems = (count:number,start:number) =>{
  let res=[]
  for(let i=start;i<count+start;++i){
    res.push({
      id: `item-${i}`,
      content: `item ${i}`
    })
  }
  return res
}

// a little function to help us with reordering the result
export const reorder = (list:any, startIndex:number, endIndex:number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

export const getItemStyle = (isDragging:boolean, draggableStyle:any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

export const getListStyle = (isDraggingOver:boolean) => {
  console.log('isDraggingOver',isDraggingOver)
  return ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    width: 250
  })
};
