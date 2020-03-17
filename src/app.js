import React from 'react';
import ReactDOM from 'react-dom';
import ReactTable from 'react-table';
import './styles/style.scss';

class App extends React.Component{
  constructor(props){
        super(props);
        this.state = {
          posts:[],
          stared:[],
          checked : []
        }
  }
  // Save the stared data as soon as it updates
  componentDidUpdate(prevProps , prevState){
      if(prevState.stared.length !== this.state.stared.length){
        const staredData = JSON.stringify(this.state.stared)
        localStorage.setItem('stared' , staredData);  
      }
    }

  //Read the data.json + stared data from localStorage 
  componentDidMount(){
      console.log(this.state.stared);
    //1. Reading Data From DataSet
      const url = 'fake.json';
      fetch(url , {
        method: 'GET'
      }).then(response => {
        console.log(response)
        return response.json()
      }).then(posts =>{
        console.log('posts' , posts);
        this.setState({posts:posts});
      });
      
    //2. Fetching Stared Data from loclStorage
      if(localStorage.getItem('stared')){
        this.state.stared = JSON.parse(localStorage.getItem('stared'));
      }
    }

  render(){
    let columns = [
      // First col is a custom coll by React Table Cell
      {
        Header : '',
        sortable:false,
        filterable:false,
        style:{
          textAlign: 'center'
        },
        width:50,
        minWidth:50,
        maxWidth:50,
        Cell: (props)=>{
        
          //1. Update User Iterface (checkbox tiks) by comparing data in localStorage
          // and Every Props
          // if there is a match tik will be show
          const staredData = JSON.parse(localStorage.getItem('stared'));
          if(staredData){
            staredData.forEach((item) =>{
              if(item.id === props.original.id){
                props.original.stared = true;
              }
            })
          }
          
          return  (
            <input 
              type = 'checkbox'
              checked = {!!props.original.stared}
              className='star'
              onChange = {(e)=>{ 

              props.original.stared = !(props.original.stared)

              this.setState((prevState)=>{
                // 1. search whether the data is added before or not
                let findedIndex = prevState.stared.findIndex((data)=> data.id === props.original.id)
                // 2. if item not exist added it to state
                if(findedIndex === -1){
                  return {
                    stared : prevState.stared.concat([props.original])
                  }
                // 3. if item  exist remove it from state
                }
                else if(findedIndex !== -1){
                    return {
                      stared : prevState.stared.filter((data)=> data.id !== props.original.id)
                    }
                }
              });
            }} 
            >
            </input>
          )
        },
      },

      {
        Header : 'شماره',
        accessor : 'id',
        sortable:false,
        filterable:false,
        style:{
          textAlign: 'center'
        },
        width:80,
        minWidth:80,
        maxWidth:80
      },
      {
        Header : 'نام تغییر دهنده',
        accessor : 'name',
      },
      {
        Header : 'تاریخ',
        accessor : 'date',
        style:{
          textAlign: 'center'
        },
        width:120,
        minWidth:120,
        maxWidth:120
      },
      {
        Header : 'نام آگهی',
        accessor : 'title',
        sortable : false
      },
      {
          Header : 'فیلد',
          accessor : 'field',
          style:{
            textAlign: 'center'
          },
          width:130,
          minWidth:130,
          maxWidth:130
      },
      {
          Header : 'مقدار قدیم',
          accessor : 'old_value',
          sortable:false,
          filterable:false
      },
      {
          Header : 'مقدار جدید',
          accessor : 'new_value',
          sortable:false,
          filterable:false
      }
    ]
      return (
          <ReactTable
              columns = {columns}
              data = {this.state.posts}
              previousText = {'صفحه قبل'}
              nextText = {'صفحه بعد'}
              pageText = {'صفحه'}
              ofText ={'از'}
              filterable
          >
          </ReactTable>
      )
  }
}

ReactDOM.render(<App /> , document.getElementById('app'));