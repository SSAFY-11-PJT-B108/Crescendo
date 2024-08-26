import React, { useMemo } from 'react';
import BestPhotoSlide from '../components/favorite/BestPhotoSlide';
import Dropdown from '../components/common/Dropdown';
import { useEffect, useState } from 'react';
import FavoriteRankList from '../components/favorite/FavoriteRankList';
import { IdolGroupInfo, IdolInfo } from '../interface/favorite';
import { getidolGroupListAPI, getIdolListAPI } from '../apis/favorite';
import { useAppDispatch, useAppSelector } from '../store/hooks/hook';
import { setIdolGroupId, setIdolId, setSortByVotes } from '../features/favorite/favoriteSlice';
import { ReactComponent as WriteButton } from '../assets/images/write.svg';
import FavoriteRankPostModal from '../components/favorite/FavoriteRankPostModal';

export default function Favorite() {
  const [idolGroupOption, setIdolGroupOption] = useState<string>('');
  const [idolGroupList, setIdolGroupList] = useState<IdolGroupInfo[]>([]);
  const [idolOption, setIdolOption] = useState<string>('');
  const [idolList, setIdolList] = useState<IdolInfo[]>([]);
  const [showWriteModal, setShowWriteModal] = useState<boolean>(false);
  const { isLoggedIn } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const idolGroupOptions = useMemo(() => {
    return ['전체', ...idolGroupList.map(group => group.groupName)];
  }, [idolGroupList]);
  const idolOptions = useMemo(() => {
    return ['전체', ...idolList.map(idol => idol.idolName)];
  }, [idolList]);
  const [sortOptions] = useState<string[]>(['최신순', '좋아요순']);

  //그룹 리스트 가져오기
  useEffect(() => {
    const getIdolGroupList = async () => {
      const response = await getidolGroupListAPI();
      setIdolGroupList(response);
    };
    getIdolGroupList();
  }, []);

  //멤버 리스트 가져오기
  useEffect(() => {
    if (!idolGroupOption) {
      setIdolList([]);
      return;
    }
    const selectedGroupId =
      idolGroupList.find(group => group.groupName === idolGroupOption)?.groupId || null;
    dispatch(setIdolGroupId(selectedGroupId));
    const getIdolList = async (groupId: number) => {
      const response = await getIdolListAPI(groupId);
      setIdolList(response);
    };
    if (selectedGroupId) getIdolList(selectedGroupId);
  }, [idolGroupOption, idolGroupList, dispatch]);

  // 아이돌Id 등록
  useEffect(() => {
    const selectedIdolId = idolList.find(idol => idol.idolName === idolOption)?.idolId || null;
    dispatch(setIdolId(selectedIdolId));
  }, [idolOption, idolList, dispatch]);

  return (
    <div className="favorite">
      <div className="bestphotos_container">
        <BestPhotoSlide />
      </div>
      <div className="favorite_container">
        <div className="favorite_title">최애 자랑 갤러리</div>
        <div className="conditionbar">
          <div className="filter">
            <div className="menu">
              <Dropdown
                className="group text"
                defaultValue="그룹"
                options={idolGroupOptions}
                onSelect={selected => setIdolGroupOption(selected)}
              />
            </div>
            <div className="menu">
              <Dropdown
                className="member text"
                defaultValue="멤버"
                options={idolOptions}
                onSelect={selected => setIdolOption(selected)}
              />
            </div>
          </div>
          <div className="sort menu">
            <Dropdown
              className="sort text"
              defaultValue="정렬"
              options={sortOptions}
              onSelect={selected => {
                dispatch(setSortByVotes(selected));
              }}
              iconPosition="left"
            />
          </div>
        </div>
        <FavoriteRankList />
      </div>
      {isLoggedIn && (
        <WriteButton className="write-button" onClick={() => setShowWriteModal(true)} />
      )}
      {showWriteModal && (
        <FavoriteRankPostModal
          onClose={() => setShowWriteModal(false)}
          idolGroupList={idolGroupList}
        />
      )}
    </div>
  );
}
