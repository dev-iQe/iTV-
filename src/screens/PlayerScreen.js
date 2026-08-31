import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import Video from "react-native-video";
import Ionicons from "react-native-vector-icons/Ionicons";
import Slider from "@react-native-community/slider";
import { useAppTheme } from "../context/ThemeContext";

export default function PlayerScreen({ route, navigation }) {
  const { title, sources = [], arabicSubtitleUrl } = route.params;
  const { theme } = useAppTheme();
  const videoRef = useRef(null);

  const [qualityIndex, setQualityIndex] = useState(0);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [subtitlesOn, setSubtitlesOn] = useState(!!arabicSubtitleUrl);
  const [paused, setPaused] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [progress, setProgress] = useState({ current: 0, duration: 0 });
  const [seeking, setSeeking] = useState(false);
  const [resumeAt, setResumeAt] = useState(0);

  const currentSource = sources[qualityIndex] || sources[0];

  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const changeQuality = (index) => {
    setResumeAt(progress.current);
    setQualityIndex(index);
    setShowQualityMenu(false);
  };

  const seekBy = (deltaSeconds) => {
    const target = Math.max(0, progress.current + deltaSeconds);
    videoRef.current?.seek(target);
  };

  return (
    <View style={styles.container}>
      <Pressable style={StyleSheet.absoluteFill} onPress={() => setControlsVisible((v) => !v)}>
        <Video
          ref={videoRef}
          source={{ uri: currentSource?.url, startPosition: resumeAt * 1000 }}
          style={StyleSheet.absoluteFill}
          resizeMode="contain"
          paused={paused}
          playInBackground
          playWhenInactive
          pictureInPicture
          ignoreSilentSwitch="obey"
          onProgress={(data) => {
            if (!seeking) setProgress({ current: data.currentTime, duration: data.seekableDuration });
          }}
          onLoad={(data) => {
            setProgress((p) => ({ ...p, duration: data.duration }));
          }}
          textTracks={
            arabicSubtitleUrl
              ? [
                  {
                    title: "العربية",
                    language: "ar",
                    type: "text/vtt",
                    uri: arabicSubtitleUrl,
                  },
                ]
              : []
          }
          selectedTextTrack={
            subtitlesOn && arabicSubtitleUrl
              ? { type: "language", value: "ar" }
              : { type: "disabled" }
          }
        />
      </Pressable>

      {controlsVisible && (
        <View style={styles.overlay}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
              <Ionicons name="chevron-down" size={26} color="#fff" />
            </TouchableOpacity>
            <Text numberOfLines={1} style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={() => videoRef.current?.presentFullscreenPlayer?.()} style={styles.iconBtn}>
              <Ionicons name="albums-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.centerControls}>
            <TouchableOpacity onPress={() => seekBy(-10)} style={styles.iconBtn}>
              <Ionicons name="play-back" size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPaused((p) => !p)} style={styles.playBtn}>
              <Ionicons name={paused ? "play" : "pause"} size={38} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => seekBy(10)} style={styles.iconBtn}>
              <Ionicons name="play-forward" size={30} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomBar}>
            <View style={styles.progressRow}>
              <Text style={styles.timeText}>{formatTime(progress.duration)}</Text>
              <Slider
                style={{ flex: 1, marginHorizontal: 8 }}
                minimumValue={0}
                maximumValue={progress.duration || 1}
                value={progress.current}
                minimumTrackTintColor={theme.accent}
                maximumTrackTintColor="rgba(255,255,255,0.3)"
                thumbTintColor={theme.accent}
                onSlidingStart={() => setSeeking(true)}
                onSlidingComplete={(val) => {
                  videoRef.current?.seek(val);
                  setSeeking(false);
                }}
              />
              <Text style={styles.timeText}>{formatTime(progress.current)}</Text>
            </View>
            <View style={styles.bottomActions}>
              {!!arabicSubtitleUrl && (
                <TouchableOpacity
                  onPress={() => setSubtitlesOn((v) => !v)}
                  style={[styles.pill, subtitlesOn && { backgroundColor: theme.accent }]}
                >
                  <Ionicons name="text" size={14} color="#fff" />
                  <Text style={styles.pillText}>ترجمة عربية</Text>
                </TouchableOpacity>
              )}

              {sources.length > 1 && (
                <TouchableOpacity onPress={() => setShowQualityMenu(true)} style={styles.pill}>
                  <Ionicons name="settings-outline" size={14} color="#fff" />
                  <Text style={styles.pillText}>{currentSource?.quality || "الجودة"}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}

      <Modal transparent visible={showQualityMenu} animationType="fade">
        <Pressable style={styles.modalBg} onPress={() => setShowQualityMenu(false)}>
          <View style={styles.qualitySheet}>
            <Text style={styles.qualityHeader}>اختر الجودة</Text>
            {sources.map((s, idx) => (
              <TouchableOpacity key={s.quality} style={styles.qualityRow} onPress={() => changeQuality(idx)}>
                <Text style={styles.qualityText}>{s.quality}</Text>
                {idx === qualityIndex && <Ionicons name="checkmark" size={18} color="#fff" />}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  topBar: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  title: { color: "#fff", fontWeight: "700", fontSize: 15, flex: 1, textAlign: "center" },
  iconBtn: { padding: 8 },
  centerControls: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  playBtn: { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 40, padding: 14 },
  bottomBar: { paddingHorizontal: 16, paddingBottom: 36 },
  progressRow: { flexDirection: "row-reverse", alignItems: "center", marginBottom: 14 },
  timeText: { color: "#fff", fontSize: 11, minWidth: 34, textAlign: "center" },
  bottomActions: { flexDirection: "row-reverse", gap: 10 },
  pill: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  pillText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  qualitySheet: { backgroundColor: "#1A1A20", borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16 },
  qualityHeader: { color: "#fff", fontWeight: "800", fontSize: 16, textAlign: "right", marginBottom: 10 },
  qualityRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A32",
  },
  qualityText: { color: "#fff", fontSize: 15 },
});
