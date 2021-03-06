import React , { Component }from 'react';
import { Layout, Menu, Icon ,Table, notification, Button,Input, Badge,Tag} from 'antd';
import $ from 'jquery';
import PropTypes from 'prop-types';

const { Header, Content, Sider } = Layout;

let data = [];

class Book extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            data1: data,
            filteredInfo: null,
            sortedInfo: null,
            selectedRowKeys: [],
            loading:false,
            selectedTags: [],
        };
        this.getBook();
    }
    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    }

    handleChange1(tag, checked) {
        const { selectedTags } = this.state;
        const nextSelectedTags = checked ?
            [...selectedTags, tag] :
            selectedTags.filter(t => t !== tag);
        console.log('You are interested in: ', nextSelectedTags);
        this.setState({ selectedTags: nextSelectedTags });
    }
    add = () => {
        notification.open({
            message: '消息提醒',
            description: '成功添加书籍进入购物车!',
            icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
        });

    };

    rowSelection = {
        onChange(selectedRowKeys, selectedRows) {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        onSelect(record, selected, selectedRows) {
          //  let i = selectedRows.size();
            for(let i in selectedRows) {
                console.log(selectedRows[i].Book);
            }
            if(selected === true) {
                $.ajax({
                    type: "post",
                    url: "http://127.0.0.1:8080/cart/select",
                    crossDomain: true,
                    data: {Book:record.Book,user:localStorage.getItem('user')},  //相当于
                    error: function () {
                        console.log("failed");
                        //TODO 失败
                    }
                })
            }
            else{
                $.ajax({
                    type: "post",
                    url: "http://127.0.0.1:8080/book/delete",
                    crossDomain: true,
                    data: record,
                    success: function (data) {
                        console.log("取消选择书本:" + data);
                    },
                    error: function () {
                        console.log("failed");
                        //TODO 失败
                    }
                });
            }
        },
        onSelectAll(selected, selectedRows, changeRows) {
            console.log(selected, selectedRows, changeRows);
        },
    };

    clearFilters = () => {
        this.setState({ filteredInfo: null });
    };

    clearAll = () => {
        this.setState({
            filteredInfo: null,
            sortedInfo: null,
        });
    };

    getBook = () => {
        let _data="";
        data=[];
        $.ajax({
            type: "get",
            url: "http://127.0.0.1:8080/book/get",
            crossDomain: true,
            contentType: "application/json", //必须有
            dataType: "json", //表示返回值类型，不必须
            success: function (_data) {
                for(var i in _data){
                    let temp = {"Book":_data[i].title,"Author":_data[i].author,
                        "Language":_data[i].language,"Sales":_data[i].sales,
                    "Published":_data[i].published};
                    data.push(temp);
                }
                console.log(data);
                this.setState({
                    filteredInfo: null,
                    sortedInfo: null,
                });
            }.bind(this),
            error : function() {
                console.log("failed");
            }
        })
    };

    setAgeSort = () => {
        this.setState({
            sortedInfo: {
                order: 'descend',
                columnKey: 'Sales',
            },
        });
    };
    render() {
        let { sortedInfo, filteredInfo,data1 } = this.state;
        const { selectedTags } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        data1 = data1 || {};
        const columns = [{
            title: '     书籍',
            dataIndex: 'Book',
            key: 'Book',
            render: text => <a href="#">{text}</a>,
            sorter: (a, b) => a.Book.substr(0,1).charCodeAt() - b.Book.substr(0,1).charCodeAt(),
            sortOrder: sortedInfo.columnKey === 'Book' && sortedInfo.order,
        }, {
            title: '作者',
            dataIndex: 'Author',
            key: 'Author',
            filters: [
                { text: 'Antoine de Saint-Exupery', value: 'Antoine' },
                { text: 'J.R.R.Tolkien', value: 'J.R.R.Tolkien' },
                { text: 'Cao Xueqin', value: 'Cao' },
                { text: 'H.Rider Haggard', value: 'Haggard' },
                { text: 'J.K. Rowling', value: 'Rowling' },

            ],
            filteredValue: filteredInfo.Author || null,
            onFilter: (value, record) => record.Author.includes(value),
            sorter: (a, b) => a.Author.substring(0,1).charCodeAt() - b.Author.substring(0,1).charCodeAt(),
            sortOrder: sortedInfo.columnKey === 'Author' && sortedInfo.order,
        }, {
            title: '语言',
            dataIndex: 'Language',
            key: 'Language',
            filters: [
                { text: 'Chinese', value: 'Chinese' },
                { text: 'English', value: 'English' },
                { text: 'French', value: 'French' },

            ],
            filteredValue: filteredInfo.Language || null,
            onFilter: (value, record) => record.Language.includes(value),
            sorter: (a, b) => a.Language.substring(0,1).charCodeAt()  - b.Language.substring(0,1).charCodeAt() ,
            sortOrder: sortedInfo.columnKey === 'Language' && sortedInfo.order,
        }, {
            title: '出版时间',
            dataIndex: 'Published',
            key: 'Published',
            sorter: (a, b) => a.Published.split('-')[0] - b.Published.split('-')[0],
            sortOrder: sortedInfo.columnKey === 'Published' && sortedInfo.order,
        },{
            title: '销售量',
            dataIndex: 'Sales',
            key: 'Sales',
            sorter: (a, b) => a.Sales.split(' ')[0] - b.Sales.split(' ')[0],
            sortOrder: sortedInfo.columnKey === 'Sales' && sortedInfo.order,
        },];
        return (
            <Layout>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                        <div>
                            <div style={{marginTop:10}}>

                            </div>
                            <div style={{marginTop:20}}className="table-operations">
                                <Button onClick={this.setAgeSort}>按销量排序</Button>
                                <Button onClick={this.clearFilters}>取消筛选</Button>
                                <Button onClick={this.clearAll}>取消筛选和排序</Button>
                            </div>

                            <div style={{marginTop: 20}}>
                            <Table columns={columns} loading={this.loading} dataSource={data}
                                   rowSelection={localStorage.getItem('user')!=='' ? this.rowSelection:null}
                                   onChange={this.handleChange} size="small"/></div>
                            {localStorage.getItem('user')!==''?
                                <Button onClick={this.add} type="primary" style={{marginLeft:300}}>加入购物车</Button>:null}
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default Book;
