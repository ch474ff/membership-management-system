class Api::V1::TeamsController < Api::BaseController
  def index
    teams = Team.includes(:members).order(:name)

    render json: teams.as_json(
      only: [:id, :name, :description, :created_at],
      methods: [],
      include: {
        members: {
          only: [:id, :name, :email]
        }
      }
    )
  end

  def show
    team = Team.includes(:members).find(params[:id])

    render json: team.as_json(
      only: [:id, :name, :description, :created_at],
      include: {
        members: {
          only: [:id, :name, :email]
        }
      }
    )
  end

  def create
    return unless require_admin

    team = Team.new(team_params)

    if team.save
      render json: team, status: :created
    else
      render json: { errors: team.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  def update
    return unless require_admin

    team = Team.find(params[:id])

    if team.update(team_params)
      render json: team
    else
      render json: { errors: team.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  def destroy
    return unless require_admin

    Team.find(params[:id]).destroy!
    head :no_content
  end

  private

  def team_params
    params.require(:team).permit(:name, :description)
  end
end
