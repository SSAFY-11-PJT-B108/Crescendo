import React, { useEffect, useRef, useState } from 'react';
import { ReactComponent as Close } from '../../assets/images/challenge/close.svg';
import { ReactComponent as AddImage } from '../../assets/images/img_add.svg';
import { postChallengeAPI } from '../../apis/challenge';
import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../store/hooks/hook';
import { initialChallengeList } from '../../features/challenge/challengeSlice';

interface ModalProps {
  onClose: () => void;
  isOpen: boolean;
}
export default function ChallengeModal({ onClose, isOpen }: ModalProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);
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
    if (!titleRef.current?.value) {
      toast.warn('제목을 입력 해주세요:)', {
        position: 'top-center',
      });
      return;
    }
    if (!timeRef.current?.value) {
      toast.warn('종료일자를 선택해주세요!!', {
        position: 'top-center',
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', titleRef.current.value);
    formData.append('endAt', timeRef.current.value);
    formData.append('video', fileRef.current.files[0]);
    try {
      onClose();
      toast.info('등록하는데 1분정도 소요됩니다', {
        position: 'top-right',
      });

      await postChallengeAPI(formData);
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
      dispatch(initialChallengeList());
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
    <div className="holdmodal">
      <div className="holdmodal-content">
        <div className="holdmodal-header">
          <div className="holdmodal-title">챌린지생성</div>
          <span className="close" onClick={onClose}>
            <Close />
          </span>
        </div>
        <div className="holdmodal-body">
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
              <input
                type="text"
                className="input_title"
                placeholder="제목을 입력하세요"
                ref={titleRef}
              />
              <input className="input_date" id="cal" type="datetime-local" ref={timeRef} />
              {videoPreview && (
                <label htmlFor="video" className="video_label_add">
                  <AddImage className="w-16 h-16" />
                </label>
              )}

              <button className="modal-btn" onClick={CreateChallenge}>
                생성
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
