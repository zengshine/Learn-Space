function start(index) {
  !index && (promise = Promise.resolve());
  promise = promise.then(() => {
    return excute(index);
  });
}

console.log("结果顺序：");

for (let i = 0; i < 5; i++) {
  start(i);
}

function sleep(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

function excute(index) {
  let duration = Math.floor(Math.random() * 1000);

  return sleep(duration).then(() => {
    console.log("index:", index);
  });
}
