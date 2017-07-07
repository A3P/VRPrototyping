/*
  global XMLHttpRequest localStorage COMMIT_ID:true
*/
let payloadArray = [];
const uuidURL = 'https://kp3exutw5b.execute-api.us-east-1.amazonaws.com/prod/chess_stats_vr_generateUUID';

const req = (method, url, body = null) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: xhr.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = () => {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send(body);
  });

const getUSID = () => req('GET', uuidURL).then(resp => resp);

const getUUID = () => {
  if (!localStorage.getItem('UUID')) {
    return req('GET', uuidURL).then(resp => {
      localStorage.setItem('UUID', resp);
      return (localStorage.getItem('UUID'));
    });
  }
  return localStorage.getItem('UUID');
};

const getCommitID = () => COMMIT_ID;

const sendPayload = (usid) => {
  Promise.all([usid, getUUID()]).then(values => {
    const payload = {
      session_timestamp: Date.now(),
      statsArray: payloadArray,
      commitID: getCommitID(),
      uuid: values[1],
    };

    const url = `https://kp3exutw5b.execute-api.us-east-1.amazonaws.com/prod/chess_stats_vr_writeStats?USID=${
      values[0]}`;

    req('POST', url, JSON.stringify(payload));
    payloadArray = [];
  }, reason => {
    console.log('ERROR:', reason);
  });
};

const checkForStats = (stats, renderInfo, usid) => {
  if (stats.fps) {
    stats.geometries = renderInfo.memory.geometries;
    stats.vertices = renderInfo.render.vertices;
    stats.faces = renderInfo.render.faces;
    payloadArray.push(stats);
    if (payloadArray.length >= 120) {
      sendPayload(usid);
    }
  }
};

export { checkForStats, getUSID };
