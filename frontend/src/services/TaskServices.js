import axios from 'axios';

export const saveTaskChanges_put = async(__prp, __val, _projectShortId, _taskId, _accessToken,) => {
    let url = 'http://127.0.0.1:4000/tasks/' + _taskId;
    let data = {
      prp: __prp,
      val: __val,
    }
    const config = {
      headers: { authtoken: _accessToken },
    }
  
    try {
  
      let response = await axios.put(url, data, config);
      return response.data;
    } catch (error) {
      console.log(error);
      return { status: 0, msg: "Error, failed getting data from server!", sev: "error", err: error };
    }
  }