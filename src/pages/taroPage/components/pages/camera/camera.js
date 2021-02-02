import "./camera.scss";

import React from "react";
import Taro from "@tarojs/taro-rn";
import { Camera, Button, View, Image, Video } from "@tarojs/components";
import Header from "../../components/head/head";

export default class PageView extends React.Component {
  cameraContext;
  ref = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      devicePosition: "back",
      imageSrc: "",
      videoUrl: ""
    };
  }

  handleError() {
    alert("您的浏览器不允许使用摄像头");
  }

  handleStop() {
    alert("摄像头被非正常终止");
  }

  toggleDevice = () => {
    this.setState({
      devicePosition: this.state.devicePosition == "back" ? "front" : "back"
    });
  };

  takePhoto = () => {
    this.cameraContext.takePhoto({
      quality: "high",
      success: res => {
        const { tempImagePath } = res;
        this.setState({
          imageSrc: tempImagePath
        });
      }
    });
  };

  startRecord = () => {
    Taro.showToast({
      title: "开始录像",
      icon: "none"
    });
    console.log('开始录像');
    this.cameraContext.startRecord();
  };

  stopRecord = () => {
    Taro.showToast({
      title: "停止录像",
      icon: "none"
    });
    console.log('停止录像', this.cameraContext);
    this.cameraContext.stopRecord({
      success: result => {
        console.log(result);
        const { tempVideoPath } = result;
        this.setState({
          videoUrl: tempVideoPath
        });
      }
    });
  };

  render() {
    const { imageSrc, devicePosition, videoUrl } = this.state;
    return (
      <View className="components-page">
        <View className="components-page__header">
          <Header title="Camera" />
        </View>
        <View className="components-page__body">
          <View className="components-page__body-example example">
            <View className="example-body">
              <Camera
                id="camera"
                className="cammer-content"
                ref={this.ref}
                onStop={this.handleStop}
                onError={this.handleError}
                devicePosition={this.state.devicePosition}
                onInitDone={() => {
                  this.cameraContext = Taro.createCameraContext("camera");
                }}
              />
            </View>
            <Button className="btn" type="primary" onClick={this.toggleDevice}>
              开启{devicePosition == "back" ? "前置" : "后置"}镜头
            </Button>
            <Button className="btn" type="primary" onClick={this.takePhoto}>
              拍照
            </Button>
            <Button className="btn" type="primary" onClick={this.startRecord}>
              开始录像
            </Button>
            <Button className="btn" type="primary" onClick={this.stopRecord}>
              停止录像
            </Button>

            {imageSrc && <Image className="preview" src={imageSrc} />}
            {videoUrl && <Video className="preview" src={videoUrl} autoplay />}
          </View>
        </View>
      </View>
    );
  }
}
