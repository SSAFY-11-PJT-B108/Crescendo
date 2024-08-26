import { useParams, useNavigate } from 'react-router-dom';
import { ReactComponent as FullStar } from '../assets/images/CommunityDetail/fullstar.svg';
import { ReactComponent as Star } from '../assets/images/CommunityDetail/star.svg';
import { ReactComponent as Close } from '../assets/images/close_white.svg';
import React, { useEffect, useRef, useState } from 'react';
import SearchInput from '../components/common/SearchInput';
import Dropdown from '../components/common/Dropdown';
import CommunityFeedList from '../components/community/CommunityFeedList';
import FeedForm from '../components/community/PostFeed';
import GalleryForm from '../components/community/PostGallery';
import { ReactComponent as WriteButton } from '../assets/images/write.svg';
import FeedDetailModal from '../components/community/FeedDetailModal';
import FanartDetailModal from '../components/community/FanartDetailModal';
import GoodsDetailModal from '../components/community/GoodsDetailModal';
import { getCommunityDetailAPI, toggleFavoriteAPI } from '../apis/community';
import { useAppDispatch, useAppSelector } from '../store/hooks/hook';
import { CommunityDetailInfo } from '../interface/communityList';
import {
  resetState,
  searchFeed,
  setFilterCondition,
  setSortCondition,
} from '../features/communityDetail/communityDetailSlice';
import CommunityFanArtList from '../components/community/CommunityFanartList';
import CommunityGoodsList from '../components/community/CommunityGoodsList';

export default function CommunityDetail() {
  const params = useParams();
  if (params.idolGroupId === undefined || !/^[1-9]\d*$/.test(params.idolGroupId)) {
    throw new Error('잘못된 접근입니다.');
  }
  const idolGroupId: number = Number(params.idolGroupId);
  const [filterOptions, setFilterOptions] = useState<string[]>([]);
  const [sortOptions, setSortOptions] = useState<string[]>([]);
  const [searchOptions, setSearchOptions] = useState<string[]>([]);
  const navigate = useNavigate();

  const initialDetail: CommunityDetailInfo = {
    idolGroupId: 0,
    name: '',
    peopleNum: 0,
    introduction: '',
    profile: '',
    banner: '',
    favoriteCnt: 0,
    isFavorite: false,
  };

  const [communityDetail, setCommunityDetail] = useState<CommunityDetailInfo>(initialDetail);
  const { isLoggedIn } = useAppSelector(state => state.auth);
  const [isSelected, setIsSelected] = useState<'feed' | 'fan-art' | 'goods'>('feed');
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const [searchOption, setSearchOption] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const dispatch = useAppDispatch();

  const [show, setShow] = useState(false);
  // const [activeTab, setActiveTab] = useState('feed');
  const [showDetail, setShowDetail] = useState(false);
  const [selectedFeedId, setSelectedFeedId] = useState<number | null>(null);
  const [selectedFanartId, setSelectedFanartId] = useState<number | null>(null);
  const [selectedGoodsId, setSelectedGoodsId] = useState<number | null>(null);

  // 데이터 가져오기, 초기세팅
  useEffect(() => {
    const getCommunityDetail = async () => {
      const response = await getCommunityDetailAPI(idolGroupId);
      setCommunityDetail(response);
    };
    getCommunityDetail();
  }, [idolGroupId]);

  useEffect(() => {
    const menuElement = menuRef.current;
    if (menuElement) {
      const activeLink = menuElement.querySelector('.active') as HTMLElement;
      if (activeLink) {
        const { offsetLeft, offsetWidth } = activeLink;
        setIndicatorStyle({
          left: offsetLeft + (offsetWidth - 160) / 2 + 'px', // Center the indicator
        });
      }
    }
    dispatch(resetState());
    setSearchOption('');
    setSearchKeyword('');
    // 드롭다운 초기화시키기위해 options 재설정
    setFilterOptions(['전체', '팔로우만']);
    setSortOptions(['최신순', '좋아요순']);
    isSelected === 'feed'
      ? setSearchOptions(['내용', '작성자'])
      : setSearchOptions(['제목', '내용', '작성자']);
  }, [isSelected, dispatch]);

  const handleClose = () => {
    setShow(false);
    setSelectedFeedId(null);
    setSelectedFanartId(null);
    setSelectedGoodsId(null);
  };

  const handleShow = () => {
    if (isLoggedIn) {
      setShow(true);
    } else {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
    }
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedFeedId(null);
    setSelectedFanartId(null);
    setSelectedGoodsId(null);
  };

  const handleShowFeedDetail = (feedId: number) => {
    setSelectedFeedId(feedId);
    setShowDetail(true);
  };

  const handleShowFanartDetail = (fanArtId: number) => {
    setSelectedFanartId(fanArtId);
    setShowDetail(true);
  };

  const handleShowGoodsDetail = (goodsId: number) => {
    setSelectedGoodsId(goodsId);
    setShowDetail(true);
  };

  const clickStar = async () => {
    try {
      await toggleFavoriteAPI(idolGroupId);
      setCommunityDetail(prev => ({
        ...prev,
        isFavorite: !prev.isFavorite,
        favoriteCnt: prev.isFavorite ? prev.favoriteCnt - 1 : prev.favoriteCnt + 1,
      }));
    } catch {
      console.error('즐겨찾기 토글 실패');
    }
  };

  return (
    <div className="communitydetail">
      <div className="banner">
        <img className="banner_img" src={communityDetail.banner} alt={communityDetail.name}></img>
        <div className="banner_name">{communityDetail.name}</div>
        <div className="banner_favoritenum">{`${communityDetail.favoriteCnt} Favorites`}</div>
        {isLoggedIn && (
          <div className="banner_starbox">
            {communityDetail.isFavorite ? (
              <FullStar className="hoverup banner_star" onClick={() => clickStar()} />
            ) : (
              <Star className="hoverup banner_star" onClick={() => clickStar()} />
            )}
          </div>
        )}
      </div>
      <div className="communitydetail_container">
        <div className="category" ref={menuRef}>
          <div
            className={`item ${isSelected === 'feed' ? 'active' : ''}`}
            onClick={() => setIsSelected('feed')}
          >
            피드
          </div>
          <div
            className={`item ${isSelected === 'fan-art' ? 'active' : ''}`}
            onClick={() => setIsSelected('fan-art')}
          >
            팬아트
          </div>
          <div
            className={`item ${isSelected === 'goods' ? 'active' : ''}`}
            onClick={() => setIsSelected('goods')}
          >
            굿즈
          </div>
          <div className="indicator" style={indicatorStyle}></div>
        </div>
        <div className="conditionbar">
          <div className="filter menu">
            <Dropdown
              className="text"
              defaultValue="필터"
              options={filterOptions}
              onSelect={selected => dispatch(setFilterCondition(selected))}
            />
          </div>
          <div className="search">
            <div className="sort menu">
              <Dropdown
                className="text"
                defaultValue="정렬"
                options={sortOptions}
                onSelect={selected => dispatch(setSortCondition(selected))}
                iconPosition="left"
              />
            </div>
            <div className="search menu">
              <Dropdown
                className="text"
                defaultValue="검색"
                options={searchOptions}
                onSelect={selected => setSearchOption(selected)}
                iconPosition="left"
              />
            </div>
            <SearchInput
              placeholder="여기에 입력하세요"
              value={searchKeyword}
              onChange={event => {
                setSearchKeyword(event.target.value);
              }}
              onSearch={() => dispatch(searchFeed({ searchOption, searchKeyword }))}
            ></SearchInput>
          </div>
        </div>
        {isSelected === 'feed' && (
          <CommunityFeedList idolGroupId={idolGroupId} onFeedClick={handleShowFeedDetail} />
        )}
        {isSelected === 'fan-art' && (
          <CommunityFanArtList idolGroupId={idolGroupId} onFanArtClick={handleShowFanartDetail} />
        )}
        {isSelected === 'goods' && (
          <CommunityGoodsList idolGroupId={idolGroupId} onGoodsClick={handleShowGoodsDetail} />
        )}
      </div>

      {<WriteButton className="write-button" onClick={handleShow} />}

      {selectedFeedId && (
        <FeedDetailModal show={showDetail} onClose={handleCloseDetail} feedId={selectedFeedId} />
      )}
      {selectedFanartId && (
        <FanartDetailModal
          show={showDetail}
          onClose={handleCloseDetail}
          fanArtId={selectedFanartId}
        />
      )}
      {selectedGoodsId && (
        <GoodsDetailModal show={showDetail} onClose={handleCloseDetail} goodsId={selectedGoodsId} />
      )}

      {show && isSelected === 'feed' && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-header-title">
                <h2>글작성</h2>
              </div>
              <div className="tabs">
                <div className={'tab'}>피드</div>
              </div>
              <Close className="close" onClick={handleClose} />
            </div>
            <div className="modal-body">
              <FeedForm onClose={handleClose} />
            </div>
          </div>
        </div>
      )}
      {show && isSelected === 'fan-art' && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-header-title">
                <h2>글작성</h2>
              </div>
              <div className="tabs">
                <button className={'tab'}>팬아트</button>
              </div>
              <Close className="close" onClick={handleClose} />
            </div>
            <div className="modal-body">
              <GalleryForm category="팬아트" onClose={handleClose} />
            </div>
          </div>
        </div>
      )}
      {show && isSelected === 'goods' && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-header-title">
                <h2>글작성</h2>
              </div>
              <div className="tabs">
                <button className={'tab'}>굿즈</button>
              </div>
              <Close className="close" onClick={handleClose} />
            </div>
            <div className="modal-body">
              <GalleryForm category="굿즈" onClose={handleClose} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
