import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import cn from 'classnames';
import _ from 'lodash';
import { MenuLoadFiles } from './MenuLoadFiles';
import { actualUiApplication } from '../../reducers';
import footerStyle from '../../styles/FooterInputMessage/FooterInputMessage.css';
import { IApplicationState } from '../../Global_Interface';
import * as actions from '../../actions';

const discoverHeightFooter = (count: number) => {
  let heightFooter = '';
  switch (count) {
    case 1:
      heightFooter = '9%';
      break;
    case 2:
      heightFooter = '11%';
      break;
    case 3:
      heightFooter = '13%';
      break;
    case 4:
      heightFooter = '15%';
      break;
    case 5:
      heightFooter = '17%';
      break;
    default:
      heightFooter = '7%';
  }
  return heightFooter;
};

const actionCreators = {
  setUiCountRows: actualUiApplication.actions.setUiCountRows,
  addNewMessage: actions.addNewMessage,
};

export const FooterInputMessage = () => {
  const [isShowMenuLoad, setIsShowMenuLoad] = useState<string>('hidden');
  const [valueMessage, setValueMessage] = useState<string>('');
  const [countSymbolsInRow, setCountSymbolsInRow] = useState<number>(0);
  const [widthTextArea, setWidthTextArea] = useState<number>(0);

  const dispatch = useDispatch();
  const { setUiCountRows, addNewMessage } = bindActionCreators(actionCreators, dispatch);

  const showMenuLoadFiles = () => {
    const isShowMenuLoadCurrent = isShowMenuLoad === 'hidden' ? 'show' : 'hidden';
    setIsShowMenuLoad(isShowMenuLoadCurrent);
  };

  const idCurrentUser = useSelector(({ allUsers }: IApplicationState) => allUsers.currentUserId);

  useEffect(() => {
    if (idCurrentUser === -1) {
      setIsShowMenuLoad('hidden');
    }
  }, [idCurrentUser]);

  const submitMessage = () => {
    const message = {
      id: Date.parse(`${new Date()}`) + Number(_.uniqueId()),
      idUser: idCurrentUser,
      idMainUser: 'Master',
      type: 'text',
      date: Date.parse(`${new Date()}`),
      value: valueMessage,
    };
    addNewMessage(message);
    setValueMessage('');
    setUiCountRows({ count: 0 });
  };

  const inputMessage = ({ target } : React.ChangeEvent<HTMLTextAreaElement>) => {
    if (target.clientWidth !== widthTextArea) {
      const widthSymbol = 13.3;
      setWidthTextArea(target.clientWidth);
      setCountSymbolsInRow(Math.floor(target.clientWidth / widthSymbol));
    }
    setValueMessage(target.value);
    if ((target.value.length % countSymbolsInRow) === 0) {
      const countRows = target.value.length / countSymbolsInRow;
      setUiCountRows({ count: countRows });
    }
  };

  const actualCountRow = useSelector(
    (state: IApplicationState) => state.actualUiApplication.countRow,
  );

  const valueHeight = discoverHeightFooter(actualCountRow);

  const styleBtnClip = cn({
    [footerStyle.btnClip]: true,
    [footerStyle.btnClipDisable]: idCurrentUser === -1,
    [footerStyle.btnClipClick]: isShowMenuLoad === 'show',
  });

  const styleBtnAddMessage = cn({
    [footerStyle.btnAddNewMessage]: true,
    [footerStyle.btnAddNewMessageDisable]: valueMessage.length === 0,
  });

  const styleFooter = cn({
    [footerStyle.container]: true,
    [footerStyle.containerHidden]: idCurrentUser === -1,
  });

  return (
    <footer className={styleFooter} style={{ height: valueHeight }}>
      <form onSubmit={submitMessage} className={footerStyle.formAddMessage}>
        <MenuLoadFiles isShowMenuLoad={isShowMenuLoad} />
        <button onClick={showMenuLoadFiles} className={styleBtnClip} disabled={idCurrentUser === -1} aria-label="showMenu" type="button" />
        <textarea onChange={inputMessage} spellCheck="false" disabled={idCurrentUser === -1} placeholder=" Write a message..." value={valueMessage} />
        <button className={styleBtnAddMessage} disabled={idCurrentUser === -1 || valueMessage.length === 0} aria-label="showMenu" type="submit" />
      </form>
    </footer>
  );
};
