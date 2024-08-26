import React, { useRef, useState, useEffect } from 'react';
import { Authapi } from '../../apis/core';
import { useParams } from 'react-router-dom';
import { ReactComponent as AddImage } from '../../assets/images/img_add.svg';
import { ReactComponent as AddTag } from '../../assets/images/tag_add.svg';
import { ReactComponent as RemoveTag } from '../../assets/images/tag_remove.svg';
import { ReactComponent as RemoveIcon } from '../../assets/images/remove_icon.svg';
import '../../scss/components/community/_postfeed.scss';
import { useAppDispatch } from '../../store/hooks/hook';
import { getFeedDetailAPI } from '../../apis/feed';
import { updateFeed } from '../../features/communityDetail/communityDetailSlice';
import { updateMyFeed } from '../../features/mypage/myFeedSlice';

type ImageWithId = {
  id: number;
  url: string;
  file?: File;
  isNew: boolean;
};

type EditFeedProps = {
  onClose: () => void;
  feedId: number;
  initialContent: string;
  initialTags: string[];
  initialImages: string[];
};

const EditFeed: React.FC<EditFeedProps> = ({
  onClose,
  feedId,
  initialContent,
  initialTags,
  initialImages,
}) => {
  const [images, setImages] = useState<ImageWithId[]>([]);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState('');
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
    setContent(initialContent);
    setTags(initialTags);
  }, [initialImages, initialContent, initialTags]);

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

  const handleTagAdd = () => {
    const formattedTag = newTag.trim();
    if (formattedTag && !tags.includes(formattedTag) && tags.length < 10) {
      setTags([...tags, newTag]);
      setNewTag('');
    } else if (tags.length >= 10) {
      alert('태그는 최대 10개까지 추가 가능합니다.');
    }
  };

  const handleNewTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\w가-힣ㄱ-ㅎㅏ-ㅣ]/g, '');
    setNewTag(value);
  };

  const handleTagRemove = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (content.trim() === '') {
      alert('내용을 입력해주세요.');
      return;
    }

    const formData = new FormData();
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

    tags.forEach(tag => formData.append('tagList', tag));

    // 필요한가?
    if (idolGroupId) {
      formData.append('idolGroupId', idolGroupId);
    }

    try {
      const response = await Authapi.put(`/api/v1/community/feed/${feedId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 204) {
        alert('피드가 성공적으로 수정되었습니다.');
        updateFeedDetail();
        onClose();
      }
    } catch (error) {
      alert('피드 수정에 실패했습니다.');
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

  const handleNewTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
    }
  };

  const updateFeedDetail = async () => {
    try {
      const response = await getFeedDetailAPI(feedId);
      dispatch(updateFeed({ feedId, feed: response }));
      dispatch(updateMyFeed({ feedId, feed: response }));
    } catch (error) {
      console.error('Error fetching feed details:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="feed-form">
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

      <div className="form-group">
        <div className="tags-wrapper">
          <div className="tags">
            {tags.map((tag, index) => (
              <span key={index} className="tag">
                #{tag}{' '}
                <RemoveTag className="removetag-button" onClick={() => handleTagRemove(tag)} />
              </span>
            ))}
            {tags.length < 10 && (
              <div className="addtag-container">
                <input
                  type="text"
                  value={newTag}
                  onChange={handleNewTagChange}
                  onKeyDown={handleNewTagKeyDown}
                  placeholder="#태그"
                  maxLength={10}
                  style={{ minWidth: '50px', width: 'auto' }}
                />
                <AddTag className="addtag-button" onClick={handleTagAdd} />
              </div>
            )}
          </div>
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

export default EditFeed;
