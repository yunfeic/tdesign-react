import React, { FC, Fragment, useState } from 'react';
import Dialog from '../../dialog';
import useConfig from '../../_util/useConfig';
import { TdUploadFile } from '../types';
import { BrowseIcon, DeleteIcon, LoadingIcon, AddIcon } from '../../icon';
import { UploadRemoveContext } from '../../_type/components/upload';

export interface ImageCardProps {
  files?: TdUploadFile[];
  multiple?: boolean;
  max?: number;
  onTrigger: () => void;
  onRemove?: (options: UploadRemoveContext) => void;
}

const ImageCard: FC<ImageCardProps> = (props) => {
  const { files, multiple = false, max = 0, onRemove } = props;
  const { classPrefix } = useConfig();
  const [showImg, setShowImg] = useState(false);
  const [imgURL, setImgURL] = useState();

  const preview = (file) => {
    setShowImg(true);
    setImgURL(file.url);
  };

  // 所有变成success或fail状态表示全部完成
  const finish = React.useMemo(() => files.every((file) => ['success', 'fail'].includes(file.status)), [files]);

  const showTrigger = React.useMemo(() => {
    if (!multiple) {
      return !max || files.length < max;
    }
    return !(files && files[0]);
  }, [files, max, multiple]);

  return (
    <Fragment>
      <Dialog
        visible={showImg}
        showOverlay
        width="auto"
        top="10%"
        className={`${classPrefix}-upload-dialog`}
        footer={false}
        header={false}
        onClose={() => {
          setShowImg(false);
          setImgURL(null);
        }}
      >
        <p className={`${classPrefix}-dialog__body-img-box`}>
          <img className={``} src={imgURL} alt="" />
        </p>
      </Dialog>
      <ul className={`${classPrefix}-upload-card`}>
        {files &&
          files.map((file, index) => (
            <li className={`${classPrefix}-upload-card__item ${classPrefix}-is--background`} key={index}>
              <div className={`${classPrefix}-upload-card__content ${classPrefix}-upload-card__box`}>
                <img className={`${classPrefix}-upload-card__image`} src={file.url} />
                <div className={`${classPrefix}-upload-card__mask`}>
                  <span className={`${classPrefix}-upload-card__mask__item`} onClick={(e) => e.stopPropagation()}>
                    <BrowseIcon
                      onClick={() => {
                        preview(file);
                      }}
                    />
                  </span>
                  <span className={`${classPrefix}-upload-card__mask__item-divider`} />
                  <span className={`${classPrefix}-upload-card__mask__item`} onClick={(e) => e.stopPropagation()}>
                    <DeleteIcon
                      onClick={(e) => {
                        onRemove?.({ e, file, index });
                      }}
                    />
                  </span>
                </div>
              </div>
            </li>
          ))}
        {showTrigger && (
          <li className={`${classPrefix}-upload-card__item ${classPrefix}-is--background`} onClick={props.onTrigger}>
            {!finish ? (
              <div className={`${classPrefix}-upload-card-container ${classPrefix}-upload-card__box`}>
                <LoadingIcon />
              </div>
            ) : (
              <div className={`${classPrefix}-upload-card-container ${classPrefix}-upload-card__box`}>
                <AddIcon />
                <p className={`${classPrefix}-upload__small`}>点击上传图片</p>
              </div>
            )}
          </li>
        )}
      </ul>
    </Fragment>
  );
};

export default ImageCard;
