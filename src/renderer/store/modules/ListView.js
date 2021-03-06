import { articleDelete, uniaccDelete, proxyAct, wechatAct, jobAct } from '@/api/source'

const state = {
  list: [],
  boolSwitchJob: false,
  boolSwitchProxy: false,
  boolSwitchMonitor: false,
  boolSwitchAntiRevoke: false,
  uniacclist: [],
  loadingMakeimgs: []
}

const mutations = {
  updateListItem(state, data) {
    if (data.type == 'update' || data.type == 'append') {
      state.list = [
        data.data,
        ...state.list.filter(element => element.msg_sn !== data.data.msg_sn)
      ]
    }
    console.log(data)
  },
  updateList(state, data) {
    state.list = data
  },
  toggleMakeImg(state, data) {
    console.log(data)
    state.loadingMakeimgs = Object.assign({}, state.loadingMakeimgs, {
      [data.row.msg_sn]: !state.loadingMakeimgs[data.row.msg_sn]
    })
    console.log(state.loadingMakeimgs)
  },
  deleteArticle(state, data) {
    state.list.splice(data.index, 1);
  },
  deleteUniacc(state, data) {
    state.uniacclist.splice(data.index, 1);
  },
  updateUniaccList(state, data) {
    state.uniacclist = data
  },
  // 由于Job任务会访问网络,所以proxy与job只能同时启动其中一个
  switchJob(state, enable) {
    if (enable) {
      state.boolSwitchProxy = !enable;
    }
    state.boolSwitchJob = enable;
  },
  switchProxy(state, enable) {
    if (enable) {
      state.boolSwitchJob = !enable;
    }
    state.boolSwitchProxy = enable;
  },
  switchMonitor(state, enable) {
    state.boolSwitchMonitor = enable;
  },
  switchAntiRevoke(state, enable) {
    state.boolSwitchAntiRevoke = enable;
  }
}

const actions = {
  updateUniaccList({ commit }, data) {
    commit('updateUniaccList', data)
  },
  toggleMakeImg({ commit }, data) {
    commit('toggleMakeImg', data)
  },
  updateListItem({ commit }, data) {
    commit('updateListItem', data)
  },
  updateList({ commit }, data) {
    commit('updateList', data)
  },
  deleteUniacc({ commit }, data) {
    uniaccDelete({
      act: 'delete',
      '_id': data.row._id
    }).then(result => {})
    commit('deleteUniacc', data)
  },
  deleteArticle({ commit }, data) {
    articleDelete({
      act: 'delete',
      '_id': data.row._id
    }).then(result => {})
    commit('deleteArticle', data)
  },
  switchJob({ commit }, enable) {
    if (enable) {
      proxyAct({
        'act': 'close'
      }).then(result => {})
    }
    jobAct({
      'act': enable ? 'start' : 'close'
    }).then(result => {})
    commit('switchJob', enable)
  },
  switchProxy({ commit }, enable) {
    if (enable) {
      jobAct({
        'act': 'close'
      }).then(result => {})
    }
    proxyAct({
      'act': enable ? 'start' : 'close'
    }).then(result => {})
    commit('switchProxy', enable)
  },
  switchMonitor({ commit }, enable) {
    wechatAct({
      'act': enable ? 'startWechatHelper' : 'closeWechatHelper'
    }).then(result => {})
    commit('switchMonitor', enable)
  },
  switchAntiRevoke({ commit }, enable) {
    wechatAct({
      'act': enable ? 'startAntiRevoke' : 'closeAntiRevoke'
    }).then(result => {})
    commit('switchAntiRevoke', enable)
  }
}

export default {
  state,
  mutations,
  actions
}
