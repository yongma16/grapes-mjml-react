// @ts-ignore
import { forwardRef, useEffect, useRef, useState,useCallback } from 'react';
import {Button,notification} from 'tdesign-react'

const ScrollDemo=(props:any,ref:any)=> {
  // @ts-ignore 列表数据
  const [listData,setListData]=useState<any>([])
  // ref
  const scrollRef=useRef<HTMLElement|any>(null);
    // 初始化数据
    const initData=()=>{
      const data=[];
      for(let i=1;i<50;++i){
        data.push({
          label:`label${i}`,
          value:`label${i}`,
        })
      }
      return data
    };
  // 重置
  const resetData=()=>{
    setListData(initData())
  };

  //追加数据
  const appendData=useCallback(()=>{
    const data=[];
    const length=listData.length
    for(let i=length+1;i<10+length;++i){
      data.push({
        label:`label${i}`,
        value:`label${i}`,
      })
    }
    setListData(listData.concat(data))
  },[listData])
  //滚动事件
  const scrollEvent=(e:any)=>{
    console.log('e',e)
    // 不使用滚动条的情况下为了适应视口中所用内容所需的最小高度
    const scrollHeight=e.target.scrollHeight
    // 从其顶部边缘滚动的像素数
    const scrollTop=e.target.scrollTop
    // dom 视口高度（不包含任何滚动条）
    const clientHeight=e.target.clientHeight
    console.log('scrollTop',scrollTop)
    console.log('clientHeight',clientHeight)
    console.log('scrollHeight',scrollHeight)
    // 向上取整
    if(Math.ceil(scrollTop+clientHeight+1)>= scrollHeight ){
      notification.info({
        title: '到底啦！',
      })
      appendData()
    }
  }
  //监听 dom滚动
  const listenDomScroll=()=>{
    try{
      if(scrollRef.current){
        //@ts-ignore
        scrollRef.current.removeEventListener('scroll',scrollEvent)
        scrollRef.current.addEventListener('scroll',scrollEvent)
      }
    }
    catch (e) {
      console.error(e)
    }
  };

  //  初始化
  useEffect(()=>{
    resetData()
  },[])
  // 数据变化重新监听dom
  useEffect(()=>{
    if(scrollRef.current){
      listenDomScroll()
    }
  },[scrollRef,listData])
  return <div style={{padding:'10px',textAlign:'left'}}>
<Button onClick={resetData} style={{margin:'10px'}}>
  重置
</Button>

    <div>
      <div style={{maxHeight:'300px',width:'200px',overflowY:'auto',}} ref={scrollRef}>
        {listData.map((item:any)=>{
          return <div key={item.value} style={{background:'#0052d9',color:'#fff',margin:'2px',padding:'2px'}}>{item.label}</div>
        })}
      </div>
    </div>

    </div>
};
export default ScrollDemo
