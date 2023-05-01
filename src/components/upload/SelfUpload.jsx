/* eslint-disable react/no-deprecated */
import React, { Component } from 'react';
import { Upload, message, Button, Icon } from 'antd';
import { isEqual } from '@/utils/tools';

// 默认文件上传样式
const Content = ({ accept = '' }) => (
    <div>
        <Button>
            <Icon type="upload" /> 点击上传
        </Button>
        <div style={{ color: '#aaa', marginTop: '5px' }}>支持 {accept.split(',').join('，')} 格式</div>
    </div>
);

export default class SelfUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: this.formatData(props.fileList)
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.formatData(nextProps.fileList), this.state.fileList)) {
            this.setState({ fileList: this.formatData(nextProps.fileList) });
        }
    }

    // 格式化参数
    formatData = data => {
        if (!data) return;
        return Array.isArray(data)
            ? data.map(
                  item =>
                      (item = {
                          uid: item.uid || item.id,
                          name: item.appendixName,
                          ...item
                      })
              )
            : {
                  uid: data.uid || data.id,
                  name: data.appendixName,
                  ...data
              };
    };

    onChange = e => {
        const { onChange, accept } = this.props;
        let { file, fileList, event } = e,
            status = file.status,
            name = file.name || file.originFileObj.name;

        // 校验文件类型
        if (!accept.includes(name.slice(name.lastIndexOf('.') + 1).toLowerCase())) {
            message.error(`文件格式错误`);
            return;
        }

        if (status === 'done') {
            message.success(`${name} 文件上传成功`);
            fileList = fileList.map(file => {
                if (file.response) {
                    let data = file.response.data;
                    file.id = data.id; // 读取文件上传的id
                    file.url = data.url; // 读取远程路径并显示链接。
                }
                return file;
            });
        } else if (status === 'error') {
            message.error(`${name} 文件上传失败`);
            fileList = fileList.filter(item => item.uid !== file.uid);
        }

        this.setState({ fileList }, () => {
            onChange && onChange(fileList, file, event);
        });
    };

    render() {
        const { fileList = [] } = this.state;
        const { children = <Content accept={this.props.accept} />, action = '/api/file/upload', maxCount = Infinity, ...rest } = this.props;
        return (
            <Upload action={action} {...rest} fileList={fileList} onChange={this.onChange}>
                {fileList.length < maxCount && children}
            </Upload>
        );
    }
}
