import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Authapi } from '../../apis/core';
import { ReactComponent as AddImage } from '../../assets/images/img_add.svg';
import { ReactComponent as RemoveIcon } from '../../assets/images/remove_icon.svg';
import '../../scss/components/community/_postfeed.scss';

type ImageWithId = {
  id: number;
  file: File;
};

interface GalleryFormProps {
  onClose: () => void;
  category: '팬아트' | '굿즈';
}

const GalleryForm = ({ onClose, category }: GalleryFormProps) => {
  const { idolGroupId } = useParams<{ idolGroupId: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<ImageWithId[]>([]);
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      const newImages = fileList.map(file => ({
        id: Date.now() + Math.random(),
        file: file,
      }));

      // 중복 검사 및 용량 제한 검사
      const existingFiles = new Set(images.map(image => image.file.name));
      const filteredImages = newImages.filter(image => {
        if (existingFiles.has(image.file.name)) {
          return false;
        }
        if (image.file.size > MAX_FILE_SIZE) {
          alert(`${image.file.name} 파일이 너무 큽니다. 20MB 이하의 파일만 업로드 가능합니다.`);
          return false;
        }
        return true;
      });
      if (images.length + filteredImages.length <= 10) {
        setImages(prevImages => [...prevImages, ...filteredImages]);
      } else {
        alert('이미지는 최대 10장까지 업로드 가능합니다.');
      }

      // 동일 파일 재업로드를 위해 초기화
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

    if (title.trim() === '') {
      alert('제목을 입력해주세요.');
      return;
    }

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
    images.forEach(image => formData.append('imageList', image.file));
    formData.append('idolGroupId', idolGroupId ?? '');

    let apiEndpoint = '';
    if (category === '팬아트') {
      apiEndpoint = '/api/v1/community/fan-art';
    } else if (category === '굿즈') {
      apiEndpoint = '/api/v1/community/goods';
    }

    try {
      const response = await Authapi.post(`${apiEndpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        alert('성공적으로 등록되었습니다.');
        window.scrollTo(0, 0);
        navigate(0);
        onClose();
      }
    } catch (error) {
      alert('작성에 실패했습니다.');
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose(); // ESC 키를 누르면 모달 닫기
      }
    };

    // 이벤트 리스너 추가
    window.addEventListener('keydown', handleKeyDown);

    // 컴포넌트가 언마운트되거나 모달이 닫힐 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <form onSubmit={handleSubmit} className="gallery-form">
      <div className="form-group image-upload-group">
        <div className="image-preview">
          {images.map((imageWithId, index) => (
            <div key={imageWithId.id} className="image-wrapper">
              <img src={URL.createObjectURL(imageWithId.file)} alt={`preview-${index}`} />
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
          작성
        </button>
      </div>
    </form>
  );
};

export default GalleryForm;
