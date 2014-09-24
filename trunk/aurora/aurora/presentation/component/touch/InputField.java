package aurora.presentation.component.touch;

import java.io.IOException;
import java.util.Map;

import uncertain.composite.CompositeMap;

import aurora.presentation.BuildSession;
import aurora.presentation.ViewContext;

@SuppressWarnings("unchecked")
public class InputField extends Component {
	
	public static final String PROPERTITY_PROMPT = "prompt";
	private static final String PROPERTITY_TYPE = "type";
	private static final String PROPERTITY_PLACHOLDER = "placeholder";
	public static final String PROPERTITY_REQUIRED = "required";
	public static final String PROPERTITY_DISABLED = "disabled";
	private static final String PROPERTITY_VALUE = "value";
	
	protected String getDefaultClass(BuildSession session, ViewContext context) {
		return "input";
	}
	
	public void onCreateViewContent(BuildSession session, ViewContext context) throws IOException{
		super.onCreateViewContent(session, context);
		Map map = context.getMap();	
		CompositeMap view = context.getView();
		
		
		String type = getDefaultClass(session, context);
		map.put(PROPERTITY_TYPE, type);
		map.put(PROPERTITY_PROMPT, view.getString(PROPERTITY_PROMPT,""));
		map.put(PROPERTITY_VALUE, view.getString(PROPERTITY_VALUE,""));
		
		String ph = view.getString(PROPERTITY_PLACHOLDER, "");
		if(!"".equals(ph)){
			String phs = "placeholder=\""+ph+"\"";
			map.put(PROPERTITY_PLACHOLDER, phs);
		}
		
		String rq = view.getString(PROPERTITY_REQUIRED, "");
		if(!"".equals(rq)){
			String rqs = "required=\""+rq+"\"";
			map.put(PROPERTITY_REQUIRED, rqs);
		}
		
		if(view.getBoolean(PROPERTITY_DISABLED,false))
			map.put(PROPERTITY_DISABLED, "disabled = 'disabled'");
	}
}
