import qr from 'qrcode';

export default (url) => {
  qr.toString(url, {type:'terminal'}, function (err, url) {
    console.log(url);
  });
};
