//functions and hooks
import React, { useEffect, useState } from "react";
import useStore from "../../utility/hooks/useStore";
import useUploadImg from "../../utility/hooks/useUploadImg";
import { updateGroupData, useGetDetail } from "../../utility/handleFirestore";
//image
import arrow from "../../assets/arrow.png";
import list from "../../assets/list.png";
import closeIcon from "../../assets/x.png";
// component
import DatePicker from "./DatePicker";
import MultiSelect from "./Multiselect";
import PayersOption from "./PayersOption";
import ParticipantsOptions from "./ParticipantsOptions";
// shadcn ui
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "../../components/ui/select";
const EditExpense = ({ displayEditExpense, setDisplayEditExpense }) => {
  //取得原有資料，setState
  //date同步問題？？
  //送出時計算
  //firestore更新
  const { editExpense, setEditExpense, resetEditExpense, group } = useStore();
  const { expenses, users } = group;
  //   const {
  //     morePayers,
  //     total_amount,
  //     singlePayerOnly,
  //     participants,
  //     note,
  //     img,
  //     participants_customized,
  //   } = editExpense;
  const morePayers = editExpense?.morePayers;
  const total_amount = editExpense?.total_amount;
  const singlePayerOnly = editExpense?.singlePayerOnly;
  const participants = editExpense?.participants;
  const note = editExpense?.note;
  const participants_customized = editExpense?.participants_customized;
  // const morePayers = editExpense?.morePayers;
  console.log(editExpense);
  const morePayersNames = morePayers ? Object.keys(morePayers) : [];
  const options = group?.users?.map(({ name }) => {
    return { label: name, value: name };
  });
  const [selected, setSelected] = useState(options || []);
  // ----------------function and variables-----------------------------
  function getAmountArr(personAmountObj) {
    if (!personAmountObj) return;
    return Object.values(personAmountObj);
  }
  function getAmountGap(amountArr) {
    if (!amountArr) return;
    const cusAmountTotal = amountArr?.reduce((acc, cur) => acc + cur, 0);
    return total_amount - cusAmountTotal;
  }
  const cusAmountArr = getAmountArr(participants_customized);
  const payersAmountArr = getAmountArr(morePayers);
  const payersAmountTotal = payersAmountArr?.reduce((acc, cur) => acc + cur, 0);
  const cusAmountTotal = cusAmountArr?.reduce((acc, cur) => acc + cur, 0);
  const cusAmountGap = getAmountGap(cusAmountArr);
  const payersAmountGap = getAmountGap(payersAmountArr);
  const participants_customNames = participants_customized
    ? Object.keys(participants_customized)
    : [];
  const [displayPayersOpt, setDisplayPayersOpt] = useState("hidden");
  const [displayParticipantOpt, setDisplayParticipantOpt] = useState("hidden");
  const [imgSrc, setImgSrc] = useState("");
  function handlePayersParticipantsDisplay(e) {
    if (e.target.id === "participant-arrow") {
      setDisplayParticipantOpt(
        displayParticipantOpt === "hidden" ? "block" : "hidden"
      );
      setDisplayPayersOpt(displayPayersOpt === "block" ? "hidden" : "hidden");
      return;
    }
    if (e.target.id === "payer-arrow") {
      setDisplayParticipantOpt(
        displayParticipantOpt === "block" ? "hidden" : "hidden"
      );
      setDisplayPayersOpt(displayPayersOpt === "hidden" ? "block" : "hidden");
      return;
    }
  }
  const groupId = "JR13SgWIQm5UNZFLwBC0";

  useEffect(() => {
    function handleGroupCalc() {
      // 0. start group calc or not
      if (expenses.length === 0) return;
      console.log("starting group calculation");
      // 3. 計算付款&平均
      //   const { payment, average } = calcPaymentAverage(expenses, users);
      //   const { totalBill } = calcBills(payment, average, users);
      //   const flow = calcFlow(totalBill);
      //   const newGroupData = { ...group, totalBill, flow };
      //   console.log(newGroupData, "newGroupData");
      // 4. totalBill, flow 塞入group
      // 4.1 整筆group更新到火基地
      //   updateGroupData(groupId, newGroupData);
      //   setGroup(newGroupData);
    }
    handleGroupCalc();
  }, [expenses, users]);

  function handleSubmit(e) {
    e.preventDefault();
    // 1. editExpense 算出ave
    const ave = calcSingleAve(editExpense);
    const expenseToAdd = { ...editExpense, ave };
    // setsomeNewExpense(ave, "ave");
    // const now = new Date().getTime();
    // console.log(now);
    // setsomeNewExpense(now, "time");
    // 2. editExpense 塞入group expenses, setGroup (觸發useEffect)
    const abc = { ...group, expenses: [...group.expenses, expenseToAdd] };
    // console.log(abc, "abc");
    // setGroup(abc);
    //加入img
    setDisplayEditExpense("hidden");
    setDisplayParticipantOpt("hidden");
    setDisplayPayersOpt("hidden");
    // resetEditExpense();
    setSelected(options);
    console.log(editExpense);
  }
  return (
    <>
      <form
        method="post"
        encType="multipart/form-data"
        action=""
        className={`${displayEditExpense}  fixed z-50 top-0 left-0 sm:top-10 md:left-[calc((100%-720px)/2)] bg-slate-400 h-full w-full sm:w-[360px] sm:h-[800px] p-3`}
        onSubmit={(e) => handleSubmit(e)}
      >
        <h1 className="text-center">編輯花費</h1>
        <img
          src={closeIcon}
          alt="closeIcon"
          onClick={() => {
            setDisplayEditExpense("hidden");
            setDisplayParticipantOpt("hidden");
            setDisplayPayersOpt("hidden");
            resetEditExpense();
            setSelected(options);
          }}
          className="absolute right-2 top-2 cursor-pointer"
        />
        <figure className="flex items-center">
          <img src={list} alt="icon" className="w-9 h-9 mr-3" />
          <figcaption>
            <label htmlFor="item">項目</label>
            <Input
              placeholder="晚餐"
              id="item"
              className=""
              value={editExpense.item}
              // required
              onChange={(e) =>
                setEditExpense({ ...editExpense, item: e.target.value })
              }
            ></Input>
          </figcaption>
        </figure>
        <figure className="flex items-center">
          <div className="w-9 h-9 bg-slate-200 mr-3 p-1">NTD</div>
          <figcaption>
            <label htmlFor="tw_amount">金額</label>
            <Input
              required
              placeholder="500"
              id="tw_amount" //
              value={total_amount || ""}
              onChange={(e) => {
                const { value } = e.target;
                const num = parseInt(value);
                if (isNaN(num) && value !== "") return;
                setEditExpense({
                  ...editExpense,
                  total_amount: num ? num : 0,
                });
              }}
            ></Input>
          </figcaption>
        </figure>
        <div className="flex items-center gap-2">
          <label htmlFor="payer">誰先付</label>
          <Select
            value={singlePayerOnly || ""}
            id="payer"
            required
            onValueChange={(value) => {
              if (value !== "多人付款") {
                setEditExpense({ ...editExpense, morePayers: {} });
              }
              // setEditExpense({ ...editExpense, singlePayerOnly: value });
              setsomeNewExpense(value, "singlePayerOnly");
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="誰？" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectScrollUpButton />
              {group?.users?.map(({ name }) => {
                return (
                  <SelectItem name="payer" key={name} value={name}>
                    {name}
                  </SelectItem>
                );
              })}
              <SelectItem
                name="payer"
                key="others"
                value="多人付款"
                className={payersAmountTotal !== 0 ? "" : "hidden"}
              >
                多人付款
              </SelectItem>
              <SelectScrollDownButton />
            </SelectContent>
          </Select>
          <img
            id="payer-arrow"
            src={arrow}
            alt="arrow"
            className="w-6 h-6"
            onClick={(e) => handlePayersParticipantsDisplay(e)}
          />
        </div>
        <p
          className={`text-red-500 ${payersAmountGap !== 0 && singlePayerOnly === "多人付款" ? "" : "hidden"}`}
        >
          此分帳尚未完成
        </p>

        <div className="flex items-center gap-2 ">
          <label htmlFor="participant">分給誰</label>
          <MultiSelect
            selected={selected}
            setSelected={setSelected}
            options={options}
          ></MultiSelect>
          <img
            src={arrow}
            alt="arrow"
            className="w-6 h-6"
            id="participant-arrow"
            onClick={(e) => {
              handlePayersParticipantsDisplay(e);
            }}
          />
        </div>
        <p
          className={`text-red-500 ${cusAmountGap !== 0 && cusAmountTotal !== 0 ? "" : "hidden"}`}
        >
          此分帳尚未完成
        </p>
        <label htmlFor="date" className="block">
          日期
        </label>
        <DatePicker id="date"></DatePicker>
        <Textarea
          placeholder="備註"
          value={note}
          onChange={(e) =>
            setEditExpense({ ...editExpense, note: e.target.value })
          }
        ></Textarea>
        <label htmlFor="uploadImg">圖片</label>
        <input
          type="file"
          accept=".jpg, .jpeg, .png"
          id="uploadImg"
          // className="hidden"
          onChange={(e) => {
            if (e.target.files[0]) {
              console.log(e.target.files);
              const src = URL.createObjectURL(e.target.files[0]);
              setImgSrc(src);
              console.log(src);
            }
          }}
        />
        <div className="bg-slate-200 w-40 h-30">
          {/* {imgSrc ? <img src={imgSrc} alt="圖片預覽" className="w-25" /> : ""} */}
        </div>
        <Button
          type="reset"
          onClick={() => {
            setDisplayEditExpense("hidden");
            setDisplayParticipantOpt("hidden");
            setDisplayPayersOpt("hidden");
            resetEditExpense();
            setSelected(options);
          }}
        >
          取消
        </Button>
        <Button
          disabled={
            (payersAmountGap !== 0 && singlePayerOnly === "多人付款") ||
            (cusAmountGap !== 0 && cusAmountTotal !== 0)
              ? true
              : false
          }
        >
          儲存
        </Button>
      </form>
      <PayersOption
        displayPayersOpt={displayPayersOpt}
        setDisplayPayersOpt={setDisplayPayersOpt}
        payersAmountGap={payersAmountGap}
        morePayersNames={morePayersNames}
      />
      <ParticipantsOptions
        displayParticipantOpt={displayParticipantOpt}
        setDisplayParticipantOpt={setDisplayParticipantOpt}
        cusAmountGap={cusAmountGap}
        cusAmountArr={cusAmountArr}
        participants_customNames={participants_customNames}
      />
    </>
  );
};

export default EditExpense;
