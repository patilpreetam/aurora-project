package aurora.presentation.component.touch;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.json.JSONObject;

import uncertain.composite.CompositeMap;
import aurora.presentation.BuildSession;
import aurora.presentation.ViewContext;

public class Ajax extends Component {

	private static final String PROPERTITY_ID = "id";
	private static final String PROPERTITY_TYPE = "type";
	private static final String PROPERTITY_URL = "url";
	private static final String PROPERTITY_MODEL = "model";
	private static final String PROPERTITY_METHOD = "method";
	private static final String PROPERTITY_TIMEOUT = "timeout";
	private static final String PROPERTITY_ASYNC = "async";
	private static final String PROPERTITY_DATATYPE = "dataType";
	private static final String PARAMETERS = "parameters";
	private static final String EVENTS = "events";

	public void onCreateViewContent(BuildSession session, ViewContext context)
			throws IOException {
		CompositeMap view = context.getView();
		Map map = context.getMap();
		CompositeMap model = context.getModel();
		if (null != view.getString(PROPERTITY_ID))
			addConfig(PROPERTITY_ID, view.getString(PROPERTITY_ID));
		if (null != view.getString(PROPERTITY_TYPE))
			addConfig(PROPERTITY_TYPE, view.getString(PROPERTITY_TYPE));
		if (null != view.getString(PROPERTITY_URL))
			addConfig(PROPERTITY_URL, uncertain.composite.TextParser.parse(view.getString(PROPERTITY_URL),model));
		else if(null != view.getString(PROPERTITY_MODEL))
			addConfig(PROPERTITY_URL, model.getObject("/request/@context_path").toString() + "/autocrud/"+view.getString(PROPERTITY_MODEL)+"/"+view.getString(PROPERTITY_METHOD));
		if (null != view.getInt(PROPERTITY_TIMEOUT))
			addConfig(PROPERTITY_TIMEOUT, view.getInt(PROPERTITY_TIMEOUT));
		if (null != view.getBoolean(PROPERTITY_ASYNC))
			addConfig(PROPERTITY_ASYNC, view.getBoolean(PROPERTITY_ASYNC));
		if (null != view.getString(PROPERTITY_DATATYPE.toLowerCase()))
			addConfig(PROPERTITY_DATATYPE,
					view.getString(PROPERTITY_DATATYPE.toLowerCase()));
		processParameters(view,model);
		processEvents(view);
		map.put(CONFIG, getConfigString());
	}

	private void processParameters(CompositeMap parent,CompositeMap model) {
		CompositeMap parameters = parent.getChild(PARAMETERS);
		if(null != parameters){
			Iterator childs = parameters.getChildIterator();
			Map datas = new HashMap();
			while (childs.hasNext()) {
				CompositeMap child = (CompositeMap) childs.next();
				String key = child.getString("name");
				String value = uncertain.composite.TextParser.parse(child.getString("value"), model);
				String bind = child.getString("bind");
				String dataType = child.getString("datatype");
				Map m = new HashMap();
				if (null != value)
					m.put("value", value);
				if (null != bind)
					m.put("bind", bind);
				if(null != dataType){
					m.put("datatype", dataType);
					if (null != value){
						if("java.lang.Long".equals(dataType)){
							m.put("value", new Long(value));
						}
					}
				}
				datas.put(key, new JSONObject(m));
			}
			if (!datas.isEmpty())
				addConfig(PARAMETERS, new JSONObject(datas));
		}
	}

	private void processEvents(CompositeMap parent) {
		CompositeMap events = parent.getChild(EVENTS);
		if(null != events){
			Iterator childs = events.getChildIterator();
			Map datas = new HashMap();
			while (childs.hasNext()) {
				CompositeMap child = (CompositeMap) childs.next();
				String key = child.getString("name");
				String handler = child.getString("handler");
				addConfig(key, new JSONFunction(handler));
			}
		}
	}
}
