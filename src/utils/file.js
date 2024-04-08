// export const urlToFileObject = async (url='') => {
//     if(typeof url !== 'string') return undefined;
//     const filename = url?.split('/').reverse()[0];

//     const response = await fetch(url);
//     const blob = await response.blob();
//     const contentType = response.headers.get('content-type');
//     const file = new File([blob], filename, { contentType });

//     return file;
// }