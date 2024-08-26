import React, { useRef, useState, useEffect } from 'react';
import { Authapi } from '../../apis/core';
import { useParams } from 'react-router-dom';
import { ReactComponent as AddImage } from '../../assets/images/img_add.svg';
import { ReactComponent as RemoveIcon } from '../../assets/images/remove_icon.svg';
import { useAppDispatch } from '../../store/hooks/hook';
import { getFanArtDetailAPI } from '../../apis/fanart';
import { updateFanArt } from '../../features/communityDetail/communityDetailSlice';
// import { updateMyFeed } from '../../features/mypage/myFeedSlice';
import '../../scss/components/community/_postfeed.scss';
import { updateMyFanArt } from '../../features/mypage/myFeedSlice';

type ImageWithId = {
  id: number;
  url: string;
  file?: File;
  isNew: boolean;
};

type EditFanartProps = {
  onClose: () => void;
  fanArtId: number;
  initialTitle: string;
  initialContent: string;
  initialImages: string[];
};

const EditFanart: React.FC<EditFanartProps> = ({
  onClose,
  fanArtId,
  initialTitle,
  initialContent,
  initialImages,
}) => {
  const [images, setImages] = useState<ImageWithId[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(initialContent);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

  const { idolGroupId } = useParams<{ idolGroupId: string }>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initialImageObjects = initialImages.map((url, index) => ({
      id: index,
      url: `https://www.crescendo.o-r.kr/server/files/${url}`,
      isNew: false,
    }));
    setImages(initialImageObjects);
    setTitle(initialTitle);
    setContent(initialContent);
  }, [initialImages, initialTitle, initialContent]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      const newImages = fileList.map(file => ({
        id: Date.now() + Math.random(),
        url: URL.createObjectURL(file),
        file: file,
        isNew: true,
      }));

      const existingFiles = new Set(images.map(image => image.file?.name));
      const filteredImages = newImages.filter(image => {
        if (existingFiles.has(image.file!.name)) {
          return false;
        }
        if (image.file!.size > MAX_FILE_SIZE) {
          alert(`${image.file!.name} 파일이 너무 큽니다. 20MB 이하의 파일만 업로드 가능합니다.`);
          return false;
        }
        return true;
      });
      if (images.length + filteredImages.length <= 10) {
        setImages(prevImages => [...prevImages, ...filteredImages]);
      } else {
        alert('이미지는 최대 10장까지 업로드 가능합니다.');
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageRemove = (id: number) => {
    setImages(images.filter(image => image.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (content.trim() === '') {
      alert('내용을 입력해주세요.');
      return;
    }

    if (images.length === 0) {
      alert('최소 한 장의 이미지를 업로드해야 합니다.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    for (const image of images) {
      if (!image.isNew) {
        const response = await fetch(image.url);
        const blob = await response.blob();
        const file = new File([blob], `existing_image_${image.id}.jpg`, { type: blob.type });
        formData.append('imageList', file);
      } else if (image.isNew && image.file) {
        formData.append('imageList', image.file);
      }
    }

    if (idolGroupId) {
      formData.append('idolGroupId', idolGroupId);
    }

    try {
      const response = await Authapi.put(`/api/v1/community/fan-art/${fanArtId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        alert('수정되었습니다.');
        updateFeedDetail();
        onClose();
      }
    } catch (error) {
      alert('게시물 수정에 실패했습니다.');
    }
  };

  const handleAddImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 400) {
      setContent(e.target.value);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 25) {
      setTitle(e.target.value);
    }
  };

  const updateFeedDetail = async () => {
    try {
      const response = await getFanArtDetailAPI(fanArtId);
      dispatch(updateFanArt({ fanArtId, fanArt: response }));
      dispatch(updateMyFanArt({ fanArtId, fanArt: response }));
    } catch (error) {
      console.error('Error fetching feed details:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="gallery-form">
      <div className="form-group image-upload-group">
        <div className="image-preview">
          {images.map((imageWithId, index) => (
            <div key={imageWithId.id} className="image-wrapper">
              <img src={imageWithId.url} alt={`preview-${index}`} />
              <RemoveIcon
                className="remove-image"
                onClick={() => handleImageRemove(imageWithId.id)}
              >
                취소
              </RemoveIcon>
            </div>
          ))}
        </div>
        {images.length < 10 && (
          <div className="add-image-container" onClick={handleAddImageClick}>
            <AddImage className="custom-file-upload" />
          </div>
        )}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <span className="image-count">{images.length}/10</span>
      </div>

      <div className="form-group">
        <div className="select-title-group">
          <div className="title-wrapper">
            <input
              type="text"
              placeholder="제목을 입력하세요 (최대 25자)"
              value={title}
              onChange={handleTitleChange}
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <div className="textarea-wrapper">
          <textarea
            placeholder="내용을 입력하세요"
            rows={5}
            value={content}
            onChange={handleContentChange}
          />
          <span className="char-count">{content.length}/400</span>
        </div>
      </div>

      <div className="submit-container">
        <button type="submit" className="submit-button">
          수정
        </button>
      </div>
    </form>
  );
};

export default EditFanart;
