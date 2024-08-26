import React, { useEffect, useRef, useState } from 'react';
import { ReactComponent as Close } from '../../assets/images/challenge/close.svg';
import { ReactComponent as AddImage } from '../../assets/images/img_add.svg';
import { postChallengeJoinAPI } from '../../apis/challenge';
import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../store/hooks/hook';
import { initialChallengeDetailList } from '../../features/challenge/challengeDetailSlice';
import { incrementParticipants } from '../../features/challenge/challengeSlice';

interface ModalProps {
  onClose: () => void;
  challengeId: number;
}
export default function ChallengeDetailModal({ onClose, challengeId }: ModalProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const CreateChallenge = async () => {
    if (!fileRef.current?.files || fileRef.current.files.length === 0) {
      toast.warn('파일을 업로드 해주세요:)', {
        position: 'top-center',
      });
      return; // 파일이 없으면 함수 종료
    }

    const formData = new FormData();
    formData.append('video', fileRef.current.files[0]);
    try {
      onClose();
      toast.info('등록하는데 1분정도 소요됩니다', {
        position: 'top-right',
      });
      await postChallengeJoinAPI(challengeId, formData);
      dispatch(incrementParticipants(challengeId));
      toast.info('등록이 완료되었습니다', {
        position: 'top-right',
      });
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        toast.error(`${err.response?.data}`, {
          position: 'top-center',
        });
      }
    } finally {
      dispatch(initialChallengeDetailList());
    }
  };

  const handleFileChange = () => {
    if (fileRef.current?.files && fileRef.current.files.length > 0) {
      const file = fileRef.current.files[0];
      const videoURL = URL.createObjectURL(file);
      setVideoPreview(videoURL);
    }
  };

  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);
  return (
    <div className="detailmodal">
      <div className="detailmodal-content">
        <div className="detailmodal-header">
          <div className="detailmodal-title">챌린지등록</div>
          <span className="close" onClick={onClose}>
            <Close />
          </span>
        </div>
        <div className="detailmodal-body">
          <div className="flex flex-row w-full">
            {videoPreview ? (
              <video
                ref={videoRef}
                controls
                src={videoPreview}
                className="video-preview object-cover"
              />
            ) : (
              <label htmlFor="video" className="video_label">
                <AddImage />
              </label>
            )}

            <input
              id="video"
              type="file"
              className="hidden"
              accept="video/mp4"
              ref={fileRef}
              onChange={handleFileChange}
            />
            <div className="right-content">
              <button className="modal-btn" onClick={CreateChallenge}>
                등록
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
