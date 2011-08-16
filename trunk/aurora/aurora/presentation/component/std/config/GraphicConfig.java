package aurora.presentation.component.std.config;

import uncertain.composite.CompositeMap;


public class GraphicConfig extends ComponentConfig {
	
	public static final String TAG_NAME = "graphic";
	
	public static final String PROPERTITY_FILTERS = "filters";
	public static final String PROPERTITY_DROP_TO = "dropto";
	public static final String PROPERTITY_RENDERER = "renderer";
	
	public static GraphicConfig getInstance(){
		GraphicConfig model = new GraphicConfig();
        model.initialize(GraphicConfig.createContext(null,TAG_NAME));
        return model;
    }
	
	public static GraphicConfig getInstance(CompositeMap context){
		GraphicConfig model = new GraphicConfig();
        model.initialize(GraphicConfig.createContext(context,TAG_NAME));
        return model;
    }
	
	public String getFilters(){
        return getString(PROPERTITY_FILTERS);
    }
    public void setShowBorder(String filters){
        putString(PROPERTITY_FILTERS, filters);
    }
    public String getDropTo(){
    	return getString(PROPERTITY_DROP_TO);
    }
    public void setDropTo(String dropTo){
    	putString(PROPERTITY_DROP_TO, dropTo);
    }
    public String getRenderer(){
		return getString(PROPERTITY_RENDERER);
	}
	public void setRenderer(String renderer){
		putString(PROPERTITY_RENDERER,renderer);
	}
}
