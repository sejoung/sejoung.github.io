---
layout: post
title: "Wowza Streaming Engine Java API로 라이브 스트림 녹화를 시작하고 중지하십시오"
date: 2019-03-21 17:00 +0900
comments: true
tags : ["wowza","streaming engine","wowza java api","와우자","와우자"]
categories : ["java"]
sitemap :
  changefreq : daily
  priority : 1.0
---
## Wowza Streaming Engine Java API로 라이브 스트림 녹화를 시작하고 중지하십시오

```java

package io.github.sejoung;

import java.util.HashMap;
import java.util.Map;

import com.wowza.wms.amf.AMFPacket;
import com.wowza.wms.application.IApplicationInstance;
import com.wowza.wms.application.WMSProperties;
import com.wowza.wms.livestreamrecord.model.ILiveStreamRecord;
import com.wowza.wms.livestreamrecord.model.LiveStreamRecorderMP4;
import com.wowza.wms.media.model.MediaCodecInfoAudio;
import com.wowza.wms.media.model.MediaCodecInfoVideo;
import com.wowza.wms.module.IModuleOnStream;
import com.wowza.wms.module.ModuleBase;
import com.wowza.wms.stream.IMediaStream;
import com.wowza.wms.stream.IMediaStreamActionNotify3;

public class ModuleLiveStreamRecordAutoRecord extends ModuleBase implements IModuleOnStream {
	private Map<String, ILiveStreamRecord> recorders = new HashMap<String, ILiveStreamRecord>();
	private IApplicationInstance appInstance;

	public void onAppStart(IApplicationInstance appInstance) {
		this.appInstance = appInstance;
	}

	enum StreamType {
		aac
	}

	class StreamListener implements IMediaStreamActionNotify3 {

		@Override
		public void onMetaData(IMediaStream stream, AMFPacket metaDataPacket) {
			getLogger().info("onMetaData[" + stream.getContextStr() + "]: " + metaDataPacket.toString());
		}

		@Override
		public void onPauseRaw(IMediaStream stream, boolean isPause, double location) {
			getLogger()
					.info("onPauseRaw[" + stream.getContextStr() + "]: isPause:" + isPause + " location:" + location);
		}

		@Override
		public void onPause(IMediaStream stream, boolean isPause, double location) {
			getLogger().info("onPause[" + stream.getContextStr() + "]: isPause:" + isPause + " location:" + location);
		}

		@Override
		public void onPlay(IMediaStream stream, String streamName, double playStart, double playLen, int playReset) {
			getLogger().info("onPlay[" + stream.getContextStr() + "]: playStart:" + playStart + " playLen:" + playLen
					+ " playReset:" + playReset);
		}

		@Override
		public void onPublish(IMediaStream stream, String streamName, boolean isRecord, boolean isAppend) {
			getLogger().info("onPublish[" + stream.getContextStr() + "]: streamName:" + streamName + " isRecord:"
					+ isRecord + " isAppend:" + isAppend + " StreamTranscoderList "
					+ stream.getLiveStreamTranscoderList());

			String type = streamName.substring(streamName.lastIndexOf("_") + 1);
			getLogger().info("type: " + type);
			// create a livestreamrecorder instance to create .mp4 files
			if (StreamType.aac.toString().equals(type)) {
				ILiveStreamRecord recorder = new LiveStreamRecorderMP4();
				recorder.init(appInstance);
				recorder.setRecordData(true);
				recorder.setStartOnKeyFrame(true);
				recorder.setVersionFile(true);

				// add it to the recorders list
				synchronized (recorders) {
					ILiveStreamRecord prevRecorder = recorders.get(streamName);
					if (prevRecorder != null)
						prevRecorder.stopRecording();
					recorders.put(streamName, recorder);
				}
				// start recording, create 1 minute segments using default content path
				getLogger().info("--- startRecordingSegmentByDuration for 60 minutes");
				// recorder.startRecordingSegmentByDuration(stream, null, null, 60 * 60 * 1000);
				// start recording, create 1MB segments using default content path
				// getLogger().info("--- startRecordingSegmentBySize for 1MB");
				// recorder.startRecordingSegmentBySize(stream, null, null, 1024*1024);
				// start recording, create new segment at 1:00am each day.
				// getLogger().info("--- startRecordingSegmentBySchedule every "0 1 * * * *");
				// recorder.startRecordingSegmentBySchedule(stream, null, null, "0 1 * * * *");

				// start recording, using the default content path, do not append (i.e.
				// overwrite if file exists)
				getLogger().info("--- startRecording");
				recorder.startRecording(stream, false);

				// log where the recording is being written
				getLogger().info(
						"onPublish[" + stream.getContextStr() + "]: new Recording started:" + recorder.getFilePath());
			}

		}

		@Override
		public void onUnPublish(IMediaStream stream, String streamName, boolean isRecord, boolean isAppend) {
			getLogger().info("onUnPublish[" + stream.getContextStr() + "]: streamName:" + streamName + " isRecord:"
					+ isRecord + " isAppend:" + isAppend);

			String type = streamName.substring(streamName.lastIndexOf("_") + 1);

			getLogger().info("type: " + type);

			if (StreamType.aac.toString().equals(type)) {
				ILiveStreamRecord recorder = null;
				synchronized (recorders) {
					recorder = recorders.remove(streamName);
				}

				if (recorder != null) {
					// grab the current path to the recorded file
					String filepath = recorder.getFilePath();

					// stop recording
					recorder.stopRecording();
					getLogger().info("onUnPublish[" + stream.getContextStr() + "]: File Closed:" + filepath);
				}
			} else {
				getLogger().info("onUnPublish[" + stream.getContextStr() + "]: streamName:" + streamName
						+ " stream recorder not found");
			}
		}

		@Override
		public void onSeek(IMediaStream stream, double location) {
			getLogger().info("onSeek[" + stream.getContextStr() + "]: location:" + location);
		}

		@Override
		public void onStop(IMediaStream stream) {
			getLogger().info("onStop[" + stream.getContextStr() + "]: ");
		}

		@Override
		public void onCodecInfoAudio(IMediaStream stream, MediaCodecInfoAudio codecInfoAudio) {
			getLogger().info("onCodecInfoAudio[" + stream.getContextStr() + " Audio Codec"
					+ codecInfoAudio.toCodecsStr() + "]: ");
		}

		@Override
		public void onCodecInfoVideo(IMediaStream stream, MediaCodecInfoVideo codecInfoVideo) {
			getLogger().info("onCodecInfoVideo[" + stream.getContextStr() + " Video Codec"
					+ codecInfoVideo.toCodecsStr() + "]: ");
		}
	}

	@Override
	public void onStreamCreate(IMediaStream stream) {
		getLogger().info("onStreamCreate[" + stream + "]: clientId:" + stream.getClientId());
		IMediaStreamActionNotify3 actionNotify = new StreamListener();

		WMSProperties props = stream.getProperties();
		synchronized (props) {
			props.put("streamActionNotifier", actionNotify);
		}
		stream.addClientListener(actionNotify);
	}

	@Override
	public void onStreamDestroy(IMediaStream stream) {
		getLogger().info("onStreamDestroy[" + stream + "]: clientId:" + stream.getClientId());

		IMediaStreamActionNotify3 actionNotify = null;
		WMSProperties props = stream.getProperties();
		synchronized (props) {
			actionNotify = (IMediaStreamActionNotify3) stream.getProperties().get("streamActionNotifier");
		}
		if (actionNotify != null) {
			stream.removeClientListener(actionNotify);
			getLogger().info("removeClientListener: " + stream.getSrc());
		}
	}
}


```

위에 코드를 작성한 후에 ant 빌드후 인스톨한 위치의 lib 아래 jar 파일을 업로드 하면 된다.

그 다음엔 서버를 완전 재기동 필요함 

# 참조
-----
* [how-to-start-and-stop-live-stream-recordings-programmatically](https://www.wowza.com/docs/how-to-start-and-stop-live-stream-recordings-programmatically-imediastreamactionnotify3)
* [wowza serverapi](https://www.wowza.com/resources/serverapi/)