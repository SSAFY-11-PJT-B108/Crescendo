import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ReactComponent as AddIcon } from '../../assets/images/img_add.svg';
import { ReactComponent as RemoveIcon } from '../../assets/images/remove_icon.svg';
import { ReactComponent as GroupIcon } from '../../assets/images/Favorite/group.svg';
import { ReactComponent as IdolIcon } from '../../assets/images/Favorite/idol.svg';
import { IdolGroupInfo, IdolInfo } from '../../interface/favorite';
import { getIdolListAPI, postFavoriteRankAPI } from '../../apis/favorite';
import Dropdown from '../common/Dropdown';
import { useNavigate } from 'react-router-dom';

interface FavoritePostModalProps {
  onClose: () => void;
  idolGroupList: IdolGroupInfo[];
}

export default function FavoriteRankPostModal({ onClose, idolGroupList }: FavoritePostModalProps) {
  const navigate = useNavigate();
  const [favoriteIdolImage, setFavoriteIdolImage] = useState<File | null>(null);
  const [idolList, setIdolList] = useState<IdolInfo[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedIdol, setSelectedIdol] = useState<string>('');
  const idolGroupOptions = useMemo(() => {
    return idolGroupList.map(group => group.groupName);
  }, [idolGroupList]);
  const idolOptions = useMemo(() => {
    return idolList.map(idol => idol.idolName);
  }, [idolList]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

  // 선택된 그룹에 따라 아이돌 리스트 가져오기
  useEffect(() => {
    if (selectedGroup) {
      const getIdolList = async () => {
        const group = idolGroupList.find(group => group.groupName === selectedGroup);
        if (group) {
          const response = await getIdolListAPI(group.groupId);
          setIdolList(response);
        }
      };
      getIdolList();
      setSelectedIdol('');
    }
  }, [selectedGroup, idolGroupList]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const imageFile = e.target.files[0];

      // 용량 제한 검사
      if (imageFile.size > MAX_FILE_SIZE) {
        alert(`${imageFile.name} 파일이 너무 큽니다. 20MB 이하의 파일만 업로드 가능합니다.`);
        return;
      }
      setFavoriteIdolImage(imageFile);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!favoriteIdolImage) {
      alert('이미지를 업로드해야 합니다.');
      return;
    }

    if (!selectedGroup) {
      alert('그룹을 선택해야 합니다');
      return;
    }

    if (!selectedIdol) {
      alert('아이돌을 선택해야 합니다');
      return;
    }

    const idolId = idolList.find(idol => idol.idolName === selectedIdol)?.idolId;
    if (!idolId) {
      alert('아이돌을 찾을수 없습니다\n 다시 시도해주세요');
      return;
    }

    const formData = new FormData();
    formData.append('favoriteIdolImage', favoriteIdolImage);
    formData.append('idolId', idolId.toString());
    try {
      await postFavoriteRankAPI(formData);
      alert('성공적으로 등록되었습니다.');
      navigate(0);
    } catch (error: any) {
      if (error.response && error.response.data) {
        alert(error.response.data);
        return;
      } else {
        alert('작성에 실패했습니다.');
      }
    }
  };

  return (
    <div className="modal favorite_post_modal">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-header-title">
            <h2>최애 사진 등록</h2>
          </div>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            {favoriteIdolImage ? (
              <div className="image-input-container">
                <img
                  src={URL.createObjectURL(favoriteIdolImage)}
                  alt={`previewImg`}
                  className="preview-image"
                />
                <div className="remove-icon-box" onClick={() => setFavoriteIdolImage(null)}>
                  <RemoveIcon className="remove-icon" />
                </div>
              </div>
            ) : (
              <div
                className="image-input-container add-container"
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.click();
                }}
              >
                <AddIcon className="add-icon" />
              </div>
            )}

            <div className="select-container group-select">
              <GroupIcon className="icon" />
              <Dropdown
                className="modal-dropdown group"
                defaultValue="그룹 선택"
                options={idolGroupOptions}
                onSelect={selected => setSelectedGroup(selected)}
              />
            </div>

            <div className="select-container idol-select">
              <IdolIcon className="icon" />
              <Dropdown
                className="modal-dropdown"
                defaultValue="멤버 선택"
                options={idolOptions}
                onSelect={selected => setSelectedIdol(selected)}
              />
            </div>

            <div className="submit-container">
              <button type="submit" className="submit-button">
                작성
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
