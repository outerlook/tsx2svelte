<>
  {!salvando ? (
    <>
      <ReactCrop
        src={imagem}
        crop={crop}
        onChange={(crop) => setCrop(crop)}
        onImageLoaded={(img) => {
          imagemRef.current = img;
        }}
      />
      <Botao onClick={handleSalvar} label="Enviar" disabled={!crop.width} />
    </>
  ) : (
    <div />
  )}
</>
