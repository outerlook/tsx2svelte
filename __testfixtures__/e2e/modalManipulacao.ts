import React from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { toast } from "react-toastify";
import { styled } from "twin.macro";
import { Botao } from "ui/atomos/botoes/Botao";
import { arquivoEstaDentroDoLimite, TAMANHO_MAXIMO_FOTO_STRING } from "$shared/helpers/fileHelpers";
import { useIsMedia } from "utils/uiHelpers/useIsMedia";
import { Modal, modalMobileStyle, modalStyle } from "../../../ui/modal/ModalCustom";
import { BotaoFecharModalX } from "../../../ui/modal/BotaoFecharModalX";
import { SpinnerPadraoNeutro } from "../../../ui/atomos/spinners/spinners";
import { Typo } from "ui/ions/Tipografia";
import { throwErroImpossivel } from "utils/erroHelpers";
import { useTrocarFotoDePerfil } from "packages/frontend/src/API/mutations/trocarFotoDoPerfil";
interface Props {
  imagem: string | null;
  fecha: () => void;
}

function getCroppedImg(image: HTMLImageElement, crop: Required<Crop>) {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throwErroImpossivel("SCDC123w");
  ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, crop.width, crop.height);
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) throw new Error("SEM BLOB???");
      resolve(blob);
    }, "image/jpeg");
  });
}